package com.java.inventorysystem.RoleManagement;

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
 * Servlet implementation class SearchMember
 */
@WebServlet("/SearchMember")
public class SearchMember extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SearchMember() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		conn = DBConnectionUtility.getDatabaseConnection();
		System.out.println("SearchMember servlet connecting to DB");
		try {
			Statement stmt = conn.createStatement();
			String member = request.getParameter("?"); //Need name attribute from member field
			//Separate fname and lname fields? or one field and split fname and lname?
			String query = "SELECT * FROM member where fname = " + member;
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
	
	//Build SQL statement for searching for a member
	private ResultSet searchMember(String member) throws SQLException {
		
		String query = "";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}

}
