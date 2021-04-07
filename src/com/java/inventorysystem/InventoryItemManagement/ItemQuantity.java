package com.java.inventorysystem.InventoryItemManagement;

import java.io.IOException;
import java.util.Date;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import com.java.inventorysystem.Utilities.*;
/**
 * Servlet implementation class ItemQuantity
 */

/*
WORKFLOW
1. update item_quant in items
1. insert record into item_quantity_updates (member_id, item_id, item_name, oldQuantity, updatedQuantity, todays date, comment, type (availible types are register, increase, reduce, report missing, dispose) -> returning update_id
2. update inventory total set total_value = (total_value + (quantityDifferential * price)) where total_id = 1
3. update items_by_category set items = (items + quantityDifferential), last_update_id = update_id where category = category -> returning items
*/
@WebServlet("/ItemQuantity")
public class ItemQuantity extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ItemQuantity() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		conn = DBConnectionUtility.getDatabaseConnection();
		
		int itemId = Integer.valueOf(request.getParameter("item-id"));
		int startingQuantity = Integer.valueOf(request.getParameter("item-old-quantity"));
		int newQuantity = Integer.valueOf(request.getParameter("item-new-quantity"));
		int differential = newQuantity - startingQuantity;
		double price = Double.valueOf(request.getParameter("item-price"));
		int memberId = Integer.valueOf(request.getParameter("member-id"));
		String itemName = request.getParameter("item-name");
		String comment = request.getParameter("comment");
		String update_type = request.getParameter("update_type");
		String itemCategory = request.getParameter("item-category");
		
		System.out.println("ItemQuantity servlet connecting to DB");
		
		JSONObject returnJson = new JSONObject();
		returnJson.put("itemId", itemId);
		
		try {
			JSONObject itemSearch = this.searchItem(itemId, itemId);
			returnJson.put("deleted", itemSearch.get("deleted"));
			returnJson.put("modifiedByOtherMember", itemSearch.get("modifiedByOtherMember"));
			returnJson.put("modifiedQuantity", itemSearch.get("modifiedQuantity"));
			
			if( (boolean)returnJson.get("deleted") || (boolean)returnJson.get("modifiedByOtherMember")) {
				ClientResponseUtility.writeToClient(response, returnJson);
			}else {
				InventoryManagementUtility.changeItemQuantityInItemsTable(itemId, newQuantity, conn);
				int update_id = InventoryManagementUtility.addRecordToItemQuantityUpdatesTable(memberId, itemId, itemName, differential, memberId, comment, update_type, conn);
				boolean updateItemsByCategory = InventoryManagementUtility.updateItemsByCategory(itemCategory, differential, update_id, conn);
				boolean totalValueUpdate = InventoryManagementUtility.updateTotalValue(differential, price, conn);
				
				returnJson.put("updatedQuantity", newQuantity);
			}
			
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	private JSONObject searchItem(int itemId, int startingQuantity) throws SQLException {
		JSONObject item = new JSONObject();
		
		String query = "SELECT item_quant FROM items WHERE item_id = ?"; //TODO: SQL for setting the new amount
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setInt(1, itemId);
		ResultSet rs = stmt.executeQuery(query);
		boolean itemDeleted = true;
		boolean modifiedByOtherMember = false;
		while(rs.next()) {
			itemDeleted = false;
			int returnedQuantity = rs.getInt("item_quant");
			if( returnedQuantity != startingQuantity) {
				modifiedByOtherMember = true;
				item.put("modifiedQuantity", returnedQuantity);
			}else {
				item.put("modifiedQuantity", startingQuantity);
			}
		}
		
		item.put("deleted", itemDeleted);
		item.put("modifiedByOtherMember", modifiedByOtherMember);
		return item;
	}
	

	
	// BELOW HERE IS IN InventoryManagementUtility.java
	
	//Build SQL statement for modifying the item quantity
	private void changeItemQuantityInItemsTable(int itemId, int newQuantity) throws SQLException {
		
		String query = "UPDATE items SET item_quant = ? WHERE item_id = ?;";
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setInt(1, newQuantity);
		stmt.setInt(2, itemId);
		
		int updated = stmt.executeUpdate();
	}
	
	//Build SQL statement for modifying the item quantity
	private int addRecordToItemQuantityUpdatesTable(int memberId, int itemId, String itemName, int old_quant, int updated_quant, String comment, String update_type) throws SQLException {
		Date update_date = new Date();
		String query = "INSERT INTO item_quantity_updates (updating_member_id, item_id, item_name, old_quant, updated_quant, update_date, comment, update_type) "
						+ "VALUES (?,?,?,?,?,?,?,?)";
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setInt(1, memberId);
		stmt.setInt(2, itemId);
		stmt.setString(3, itemName);
		stmt.setInt(4, old_quant);
		stmt.setInt(5, updated_quant);
		stmt.setDate(6, (java.sql.Date) update_date);
		stmt.setString(7, comment);
		stmt.setString(8, update_type);
		ResultSet result = stmt.executeQuery();
		
		int update_id = 0;
		while(result.next()) {
			result.getInt("update_id");
		}
		return update_id;
	}
	
	private boolean isCategoryPresent(String category) throws SQLException {
		String categoryQuery = "SELECT * FROM items_by_category WHERE category = ?;";
		PreparedStatement stmt = conn.prepareStatement(categoryQuery);
		stmt.setString(1, category);
		ResultSet categorySelect = stmt.executeQuery();
		boolean categoryPresent = false;
		while(categorySelect.next()) {
			categoryPresent = true;
		}
		return categoryPresent;
	}
	
	private boolean updateItemsByCategory(String category, int itemDifferential, int last_update_id) throws SQLException {

		String updateQuery = "";
		if(isCategoryPresent(category)) {
			updateQuery += "UPDATE items_by_category SET items = ?, last_update_id = ? WHERE category = ? RETURNING items;";
		}else {
			updateQuery += "INSERT into items_by_category (items, last_update_id, category) VALUES(?,?,?) RETURNING items;";
		}
		
		PreparedStatement stmt = conn.prepareStatement(updateQuery);
		stmt.setInt(1, itemDifferential);
		stmt.setInt(2, last_update_id);
		stmt.setString(3, category);
		int updatedRows = stmt.executeUpdate();
		
		if(updatedRows > 0) {
			return true;
		}else {
			return false;
		}
	}
	
	private boolean updateTotalValue(int itemDifferential, double price) throws SQLException {
		String query = "UPDATE inventory_total SET total_value = (SELECT total_value FROM inventory_total WHERE total_id = 1) + ? WHERE total_id = 1;";
		PreparedStatement stmt = conn.prepareStatement(query);
		double balanceDifferential = itemDifferential * price;
		stmt.setDouble(1, balanceDifferential);
		int updatedRows = stmt.executeUpdate();
			
		if(updatedRows > 0) {
			return true;
		}else {
			return false;
		}
	}

}
