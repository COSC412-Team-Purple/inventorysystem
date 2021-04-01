package com.java.inventorysystem.AuthenticateMember;

import java.io.IOException;
import java.sql.Connection;
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
 * Servlet implementation class ResetPassword
 */
@WebServlet("/ResetPassword")
public class ResetPassword extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ResetPassword() {
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
		System.out.println("ResetPassword servlet connecting to DB");
		try {
			Statement stmt = conn.createStatement();
			String username = request.getParameter("?"); //need a name for the reset username field
			String password = request.getParameter("?"); //need a name for the reset password field
			String query = "UPDATE "; //TODO: SQL for replacing the password for a particular user 
			ResultSet rs = stmt.executeQuery(query);
			
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	//Check to make sure the new password meets all the password criteria
	private boolean verifyPassword(String password){
		boolean success = false;
		
		return success;
	}
	
	//Builds SQL string containing the member's new password hash that will be saved to the DB
	private boolean setNewPassword(int memberId, String password) throws SQLException {
		boolean success = false;
		
		return success;
	}

}
