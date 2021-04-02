package com.java.inventorysystem.Dashboard;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import com.java.inventorysystem.Utilities.*;
/**
 * Servlet implementation class Dashboard
 */

/*
WORKFLOW

1. select toal_value from inventory_total where total_id = 1
2. select category, items from items_by_category
3. return data to client
*/
@WebServlet("/Dashboard")
public class Dashboard extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Dashboard() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		conn = DBConnectionUtility.getDatabaseConnection();
		System.out.println("Dashboard servlet connecting to DB");
		try {
			ResultSet itemsByCategoryResults = this.getItems();
			ResultSet inventoryTotalResults = this.getInventoryTotal();

			ClientResponseUtility.writeToClient(response, this.getJsonReturnObject(inventoryTotalResults, itemsByCategoryResults));
			response.setStatus(200);
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
			response.sendError(400, "error finding inventory total and items by category data");
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	}
	
	//Build SQL statement retrieving all the item data
	private ResultSet getItems() throws SQLException {
		
		String query = "SELECT category, items FROM items_by_category";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet results = stmt.executeQuery();
			
		return results;
	}
	
	//Compute the total value of all items to be displayed on the dashboard
	private ResultSet getInventoryTotal() throws SQLException {
		String query = "SELECT total_value FROM inventory_total";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet results = stmt.executeQuery();
			
		return results;
	}
	
	private JSONObject getJsonReturnObject(ResultSet inventoryTotalResults, ResultSet itemsByCategoryResults) throws SQLException{
		JSONObject resultsJson = new JSONObject();
		
		while(inventoryTotalResults.next()) {
			resultsJson.put("inventoryTotal", inventoryTotalResults.getDouble("total_value"));
		}
		
		List<String> categories = new ArrayList();
		List<Integer> itemsInCategory= new ArrayList();
		while(itemsByCategoryResults.next()) {
			categories.add(itemsByCategoryResults.getString("category"));
			itemsInCategory.add(itemsByCategoryResults.getInt("items"));
		}
		
		resultsJson.put("categories", categories);
		resultsJson.put("itemsByCategory", itemsInCategory);
		
		return resultsJson;
	}

}
