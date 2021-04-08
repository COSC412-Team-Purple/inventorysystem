package com.java.inventorysystem.InventoryItemManagement;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class InventoryManagementUtility {
	//Build SQL statement for modifying the item quantity
	public static void changeItemQuantityInItemsTable(int itemId, int newQuantity, Connection conn) throws SQLException {
		System.out.println("new quantity: " + newQuantity);
		String query = "UPDATE items SET item_quant = ? WHERE item_id = ?;";
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setInt(1, newQuantity);
		stmt.setInt(2, itemId);
		
		int updated = stmt.executeUpdate();
	}
	
	//Build SQL statement for modifying the item quantity
	public static int addRecordToItemQuantityUpdatesTable(int memberId, int itemId, String itemName, int old_quant, int updated_quant, String comment, String update_type, Connection conn) throws SQLException {
		String query = "INSERT INTO item_quantity_updates (updating_member_id, item_id, item_name, old_quant, updated_quant, update_date, comment, update_type) "
						+ "VALUES (?,?,?,?,?,?,?,?) RETURNING update_id";
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setInt(1, memberId);
		stmt.setInt(2, itemId);
		stmt.setString(3, itemName);
		stmt.setInt(4, old_quant);
		stmt.setInt(5, updated_quant);
		stmt.setDate(6, java.sql.Date.valueOf(java.time.LocalDate.now()));
		stmt.setString(7, comment);
		stmt.setString(8, update_type);
		ResultSet result = stmt.executeQuery();
		
		int update_id = 0;
		while(result.next()) {
			update_id = result.getInt("update_id");
		}
		return update_id;
	}
	
	public static boolean isCategoryPresent(String category, Connection conn) throws SQLException {
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
	
	public static boolean updateItemsByCategory(String category, int itemDifferential, int last_update_id, Connection conn) throws SQLException {

		String updateQuery = "";
		if(isCategoryPresent(category, conn)) {
			updateQuery += "UPDATE items_by_category "
							+ "SET items = (SELECT items FROM items_by_category WHERE category = ?) + ?"
							+ ", last_update_id = ? WHERE category = ?;";
		}else {
			updateQuery += "INSERT into items_by_category (items, last_update_id, category) VALUES(?,?,?);";
		}
		
		PreparedStatement stmt = conn.prepareStatement(updateQuery);
		stmt.setString(1, category);
		stmt.setInt(2, itemDifferential);
		stmt.setInt(3, last_update_id);
		stmt.setString(4, category);
		int updatedRows = stmt.executeUpdate();
		
		if(updatedRows > 0) {
			return true;
		}else {
			return false;
		}
	}
	
	public static boolean updateTotalValue(int itemDifferential, double price, int update_id, Connection conn) throws SQLException {
		String query = "UPDATE inventory_total SET total_value = (SELECT total_value FROM inventory_total WHERE total_id = 1) + ?, last_update_id = ? WHERE total_id = 1;";
		PreparedStatement stmt = conn.prepareStatement(query);
		double balanceDifferential = itemDifferential * price;
		stmt.setDouble(1, balanceDifferential);
		stmt.setInt(2, update_id);
		int updatedRows = stmt.executeUpdate();
			
		if(updatedRows > 0) {
			return true;
		}else {
			return false;
		}
	}
}
