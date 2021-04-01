package com.java.inventorysystem.ItemSearch;

import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
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
 * Servlet implementation class ItemSearch
 */
@WebServlet("/ItemSearch")
public class ItemSearch extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ItemSearch() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		conn = DBConnectionUtility.getDatabaseConnection();
		System.out.println("ItemSearch servlet connecting to DB");
		try {
			Statement stmt = conn.createStatement();
			String item = request.getParameter("search-item");
			String category = request.getParameter("item-category");
			String department = request.getParameter("managing-department");
			//Need a name attribute for the min and max price range fields
			String query = "SELECT * FROM items where name = " + item; //when user searches by item name; need category, department, price, etc.
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
		doGet(request, response);
	}
	
	//Build SQL statement for searching for an item in the DB
	private ResultSet searchItem(String name, String category, String dept, int priceMin, int priceMax) throws SQLException {
		
		String query = "";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}

}
