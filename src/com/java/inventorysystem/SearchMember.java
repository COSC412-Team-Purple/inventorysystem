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
 * Servlet implementation class SearchMember
 */
@WebServlet("/SearchMember")
public class SearchMember extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SearchMember() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Connection conn = ServletUtility.getDatabaseConnection();
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

}
