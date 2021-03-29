package com.java.inventorysystem;

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

/**
 * Servlet implementation class ResetPassword
 */
@WebServlet("/ResetPassword")
public class ResetPassword extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ResetPassword() {
        super();
        // TODO Auto-generated constructor stub
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
		Connection conn = ServletUtility.getDatabaseConnection();
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

}
