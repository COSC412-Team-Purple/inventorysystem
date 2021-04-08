package com.java.inventorysystem.InventoryItemManagement;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import com.java.inventorysystem.Utilities.*;
/**
 * Servlet implementation class ItemDispose
 */

/*
WORKFLOW

1. insert item into items table -> return item_id
2. insert record into item_quantity_updates (member_id, item_id, item_name, itemQuantity, 0 <-(updated_quant), todays date, "disposing of item", "dispose") -> returning update_id
3. update inventory total set total_value = (total_value - (itemQuantity * price)) where total_id = 1
4. update items_by_category set items = (items - quantity), last_update_id = update_id where category = category -> returning items
5. insert into item_dispose (item_id, item_name, price, quantity, model, location, department, category, purchasedate, brand, memo, update_id)
6 delete item from items table
*/
@WebServlet("/ItemDispose")
public class ItemDispose extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ItemDispose() {
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
		String itemID         = request.getParameter("item-id");
		String itemName       = request.getParameter("item-name");
		String itemQuantity   = request.getParameter("item-quantity");
		String itemPrice      = request.getParameter("item-price");
		String itemDepartment = request.getParameter("item-department");
		String itemCategory   = request.getParameter("item-category");
		String itemModel      = request.getParameter("item-model");
		String itemLocation   = request.getParameter("item-location");
		String purchaseDate   = request.getParameter("item-purchaseDate");
		String itemBrand      = request.getParameter("item-brand");
		String itemMemo       = request.getParameter("item-memo");
		String memberID       = request.getParameter("member-id");
		String update_type    = request.getParameter("update_type");
			
		try {
			conn = DBConnectionUtility.getDatabaseConnection();
			boolean success = false;
			
			if(itemExists(itemID))
			{
				int update_id = updateItemQuantity(memberID, itemID, itemName, itemQuantity, update_type);
				
				if(update_id > -1) {
					success = updateTotal(Integer.parseInt(itemQuantity), Float.parseFloat(itemPrice));
				if(success) {
					success = updateItemsByCategory(update_id, Integer.parseInt(itemQuantity), itemCategory);
				if(success) {
					success = updateItemDispose(itemID, itemName, itemPrice, itemQuantity, itemModel, itemLocation, itemDepartment, itemCategory, purchaseDate, itemBrand, itemMemo, update_id);
				if(success) {
					success = disposeItem(itemID);
				}}}}
			}
			
			if(!success) { //Should probably make error codes instead so we know where the failure occurred
				response.sendError(400, "Failed to delete item");
			}
			
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}
	
	private boolean itemExists(String itemID) throws SQLException {
		String query = "SELECT * FROM items WHERE item_id = " + itemID;
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
		boolean success = rs.next();
		return success;
	}
	
	//2. insert record into item_quantity_updates (member_id, item_id, item_name, itemQuantity, 0 <-(updated_quant), todays date, "disposing of item", "dispose") -> returning update_id
	private int updateItemQuantity(String memberID, String itemID, String itemName, String itemQuantity, String update_type) throws SQLException {
		
		String query = "INSERT INTO item_quantity_updates (updating_member_id, item_id, "
				+ "item_name, old_quant, updated_quant, update_date, comment, update_type) "
				+ "VALUES ('" + memberID + "','" + itemID + "','" + itemName + "','" + itemQuantity + "','0','" + new Date() + "','disposing of item','" + update_type + "');";

		PreparedStatement stmt = conn.prepareStatement(query);
		int rows = stmt.executeUpdate();
		int update_id = -1;
		
		if(rows == 1)
		{
			query = "SELECT MAX(update_id) as newest_update_id FROM item_quantity_updates";
			ResultSet rs = stmt.executeQuery();
			update_id = rs.getInt("update_id");
		}
		
		return update_id;
	}
	
	//3. update inventory total set total_value = (total_value - (itemQuantity * price)) where total_id = 1
	private boolean updateTotal(int itemQuantity, float price) throws SQLException {
		
		String query = "SELECT total_value FROM inventory_total";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
		boolean success = false;
		
		if(rs.next())
		{
			float total = rs.getFloat("total_value");
			total = total - (itemQuantity * price);
			query = "UPDATE inventory_total SET total_value = " + total + " WHERE total_id = 1";
			stmt = conn.prepareStatement(query);
			int row = stmt.executeUpdate();
			success = (row == 1);
		}
		
		return success;
	}
	
	//4. update items_by_category set items = (items - quantity), last_update_id = update_id where category = category -> returning items
	private boolean updateItemsByCategory(int update_id, int itemQuantity, String itemCategory) throws SQLException {
		String query = "SELECT items FROM items_by_category WERE category = '" + itemCategory + "'";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
		boolean success = false;
		
		if(rs.next())
		{
			int items = rs.getInt("items");
			query = "UPDATE items_by_category SET items = " + (items - itemQuantity) + ", last_update_id = " + update_id + " WHERE category = " + itemCategory;
			stmt = conn.prepareStatement(query);
			int row = stmt.executeUpdate();
			
			success = (row == 1);
		}
		
		return success;
	}
	
	//5. insert into item_dispose (item_id, item_name, price, quantity, model, location, department, category, purchasedate, brand, memo, update_id)
	private boolean updateItemDispose(String itemID, String itemName, String itemPrice, String itemQuantity, String itemModel, String itemLocation, String itemDept, String itemCategory, String purchaseDate, String itemBrand, String itemMemo, int update_id) throws SQLException {
		
		//missing purchasedate, brand, memo as inputs to the servlet
		String query = "INSERT INTO item_dispose (item_id, item_name, price, item_quant, item_model, item_loc, dept_name, "
				+ " category, purchase_date, item_brand, item_memo, update_id) "
				+ "VALUES ('" + itemID + "','" + itemName + "','" + itemPrice + "','" + itemQuantity + "','" + itemModel
				+ "','" + itemLocation + "','" + itemDept + "','" + itemCategory + "','" + purchaseDate + "','" + itemBrand
				+ "','" + itemMemo + "'," + update_id + ");";

		PreparedStatement stmt = conn.prepareStatement(query);
		int row = stmt.executeUpdate();
		
		return (row == 1);
	}
	
	//6 delete item from items table
	private boolean disposeItem(String itemID) throws SQLException {
		
		String query = "DELETE FROM items WHERE item_id = " + itemID;
		PreparedStatement stmt = conn.prepareStatement(query);
		int row = stmt.executeUpdate();
			
		return (row == 1);
	}

}
