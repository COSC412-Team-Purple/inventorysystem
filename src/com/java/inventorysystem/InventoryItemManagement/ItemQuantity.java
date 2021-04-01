package com.java.inventorysystem.InventoryItemManagement;

import java.io.IOException;
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
import com.java.inventorysystem.Utilities.*;
/**
 * Servlet implementation class ItemQuantity
 */

/*
WORKFLOW

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
		System.out.println("ItemQuantity servlet connecting to DB");
		try {
			Statement stmt = conn.createStatement();
			String item = request.getParameter("?"); //Does this still come from search-item bar? 
			int amount = Integer.parseInt(request.getParameter("?")); //need a name tag associated with the increase/reduce button forms to get the amount by which to increase/decrease
			String query = "UPDATE "; //TODO: SQL for setting the new amount
			ResultSet rs = stmt.executeQuery(query);
			
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	//Build SQL statement for modifying the item quantity
	private ResultSet changeItemQuantity(String item, int amount) throws SQLException {
		
		String query = "";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}

}
