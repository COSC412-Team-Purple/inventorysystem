package com.java.inventorysystem.InventoryItemManagement;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import com.java.inventorysystem.Utilities.ClientResponseUtility;
import com.java.inventorysystem.Utilities.DBConnectionUtility;

/**
 * Servlet implementation class GetDepartmentsAndLocations
 */

/*
WORKFLOW

1. select name_dept from department
2. select item_loc from items (not repeating if possible)
3. return both result set data to client
*/
@WebServlet("/DepartmentsAndLocations")
public class GetDepartmentsAndLocations extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private Connection conn;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetDepartmentsAndLocations() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		conn = DBConnectionUtility.getDatabaseConnection();
		System.out.println("Dashboard servlet connecting to DB");
		try {
			ResultSet departmentsResults = this.getDepartments();
			ResultSet locationsResults = this.getLocations();

			ClientResponseUtility.writeToClient(response, this.getJsonReturnObject(departmentsResults, locationsResults));
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
	private ResultSet getDepartments() throws SQLException {
		
		String query = "SELECT name_dept FROM department";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet results = stmt.executeQuery();
			
		return results;
	}
	
	//Compute the total value of all items to be displayed on the dashboard
	private ResultSet getLocations() throws SQLException {
		String query = "SELECT DISTINCT item_loc FROM items";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet results = stmt.executeQuery();
			
		return results;
	}
	
	private JSONObject getJsonReturnObject(ResultSet departmentResults, ResultSet locationResults) throws SQLException{
		JSONObject resultsJson = new JSONObject();
		List<String> departments = new ArrayList();
		while(departmentResults.next()) {
			departments.add(departmentResults.getString("name_dept"));
		}
		
		List<String> locations = new ArrayList();
		while(locationResults.next()) {
			locations.add(locationResults.getString("item_loc"));
		}
		
		resultsJson.put("departments", departments);
		resultsJson.put("locations", locations);
		
		return resultsJson;
	}

}
