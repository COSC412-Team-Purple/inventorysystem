package com.java.inventorysystem.Dashboard;

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
			Statement stmt = conn.createStatement();
			String query = "SELECT * FROM ";//TODO: need table name
			ResultSet rs = stmt.executeQuery(query);
			
			while(rs.next()) {
				response.getWriter().write(rs.getString(1) + "\n");
			}

			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	}
	
	//Build SQL statement retrieving all the item data
	private ResultSet getItems() throws SQLException {
		
		String query = "";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}
	
	//Compute the total value of all items to be displayed on the dashboard
	private int calculateItemTotalValue(ResultSet rs) {
		int value = 0;
		
		return value;
	}

}
