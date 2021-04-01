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
 * this class can probably be joined with itemQuantity, they do the same thing
 */
@WebServlet("/ReportItemMissing")
public class ReportItemMissing extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ReportItemMissing() {
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
		System.out.println("ReportItemMissing servlet connecting to DB");
		try {
			Statement stmt = conn.createStatement();
			String item = request.getParameter("?"); //Is this the item from the search item bar?
			//I think we need a missing attribute in the item table?
			String query = "";
			ResultSet rs = stmt.executeQuery(query);
			
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	//Build SQL statement for setting the item as missing
	private ResultSet reportMissing(String item, int amount) throws SQLException {
		
		String query = "";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}

}
