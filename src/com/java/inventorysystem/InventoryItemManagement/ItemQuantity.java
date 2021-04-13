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
			JSONObject itemSearch = this.searchItem(itemId, startingQuantity);
			returnJson.put("deleted", itemSearch.get("deleted"));
			returnJson.put("modifiedByOtherMember", itemSearch.get("modifiedByOtherMember"));
			returnJson.put("modifiedQuantity", itemSearch.get("modifiedQuantity"));
			
			if( !(boolean)returnJson.get("deleted") && !(boolean)returnJson.get("modifiedByOtherMember")) {
				InventoryManagementUtility.changeItemQuantityInItemsTable(itemId, newQuantity, conn);
				int update_id = InventoryManagementUtility.addRecordToItemQuantityUpdatesTable(memberId, itemId, itemName, differential, memberId, comment, update_type, conn);
				System.out.println("update id: " + update_id);
				boolean updateItemsByCategory = InventoryManagementUtility.updateItemsByCategory(itemCategory, differential, update_id, conn);
				boolean totalValueUpdate = InventoryManagementUtility.updateTotalValue(differential, price, update_id, conn);
				
				returnJson.put("updatedQuantity", newQuantity);
			}
			ClientResponseUtility.writeToClient(response, returnJson);
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	private JSONObject searchItem(int itemId, int startingQuantity) throws SQLException {
		JSONObject item = new JSONObject();
		
		String query = "SELECT item_quant FROM items WHERE item_id = ?;"; //TODO: SQL for setting the new amount
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setInt(1, itemId);
		ResultSet rs = stmt.executeQuery();
		boolean itemDeleted = true;
		boolean modifiedByOtherMember = false;
		while(rs.next()) {
			itemDeleted = false;
			int returnedQuantity = rs.getInt("item_quant");
			System.out.println("starting quantity: " + startingQuantity);
			System.out.println("quantity in db: " + returnedQuantity);
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

}
