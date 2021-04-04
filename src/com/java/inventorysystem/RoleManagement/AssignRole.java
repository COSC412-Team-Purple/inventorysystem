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

import org.json.simple.JSONObject;

import com.java.inventorysystem.Utilities.*;
/**
 * Servlet implementation class AssignRole
 */

/*
WORKFLOW

1. update dept_member set position_id = position_id where member_id = member_id 
2. return success to client
*/
@WebServlet("/AssignRole")
public class AssignRole extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AssignRole() {
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
		System.out.println("AssignRole servlet connecting to DB");
		try {
			int member_id = Integer.valueOf(request.getParameter("member_id"));
			int role_id = Integer.valueOf(request.getParameter("role_id"));
			
			JSONObject returnJson = new JSONObject();
			ResultSet rs = this.setMemberRole(member_id, role_id);
			while(rs.next()) {
				returnJson.put("member_role", rs.getString("name_pos"));
			}
			
			ClientResponseUtility.writeToClient(response, returnJson);
			response.setStatus(200);
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	//Build SQL statement for setting a member's role
	private ResultSet setMemberRole(int member_id, int role_id) throws SQLException {
		
		String query = "UPDATE dept_member SET position_id = ? WHERE member_id = ? "
				+ "RETURNING (SELECT name_pos FROM member_pos WHERE position_id = ?);"; //TODO: SQL for setting the member to new role
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setInt(1, role_id);
		stmt.setInt(2, member_id);
		stmt.setInt(3, role_id);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}
}
