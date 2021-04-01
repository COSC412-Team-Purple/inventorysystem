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
 * Servlet implementation class ItemDispose
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
		conn = DBConnectionUtility.getDatabaseConnection();
		System.out.println("ItemDispose servlet connecting to DB");
		try {
			Statement stmt = conn.createStatement();
			String item = request.getParameter("?"); //Is this the item from the search item bar?
			String query = "DELETE FROM item WHERE name = " + item; //TODO: SQL for deleting item
			ResultSet rs = stmt.executeQuery(query);
			
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	//Build SQL statement for disposing the selected item
	private ResultSet disposeItem(String item) throws SQLException {
		
		String query = "";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}

}
