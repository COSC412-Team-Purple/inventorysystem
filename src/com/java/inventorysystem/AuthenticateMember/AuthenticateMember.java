package com.java.inventorysystem.AuthenticateMember;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Arrays;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.java.inventorysystem.Utilities.*;
/**
 * Servlet implementation class AuthenticateMember
 */

/*
WORKFLOW

1. select member_id from member where username and password match
2. select position_id from dept_member where member_id = member_id
3. select perms from member_pos where position_id = position_id
4. check whether the password needs to be changed
4. return member_id, perms, resetNeeded to client
*/
@WebServlet("/AuthenticateMember")
public class AuthenticateMember extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private Connection conn;
    private String defaultPassword = "default";
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AuthenticateMember() {
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
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		
		JSONObject returnJson = new JSONObject();
		try {
			//query for
			ResultSet memberInfoRs = authenticateMember(username, password);
			
			int hits = 0;
			
			while(memberInfoRs.next()) {
				hits++;
			
				int memberId = memberInfoRs.getInt("member_id");
				System.out.println("member id: " + memberId);
				returnJson.put("memberId", memberId);
				
				ResultSet permissionRs = getMemberPermissions(memberId);
				String[] permissions = permissionRs.getString("perms").split(",");
				System.out.println("member permissions: " + Arrays.toString(permissions));
				returnJson.put("permissions", Arrays.toString(permissions));
				
				
				if(password.equals(defaultPassword)) {
					returnJson.put("needsPasswordReset", true);
				}else {
					returnJson.put("needsPasswordReset", false);
				}
				
				ClientResponseUtility.writeToClient(response, returnJson);
				response.setStatus(200);
			}
			
			if(hits == 0) {
				response.sendError(400, "Member not in db");
			}

			conn.close();
		} catch (SQLException e) {
			response.sendError(400, "An error occurred");
			e.printStackTrace();
		}
	}

	
	private ResultSet authenticateMember(String username, String password) throws SQLException {
		
		
		//TODO: convert password to hash and include in SQL statement?
		
		String query = "SELECT member_id FROM member WHERE username = ? AND passw = ?";		
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setString(1, username);
		stmt.setString(2, password);
		ResultSet rs = stmt.executeQuery();
		return rs;
	}
	
	private ResultSet getMemberPermissions(int memberId) throws SQLException {
		
		//querying for permissions
		String query = "SELECT perms "
					 + "FROM member_pos "
					 + "WHERE position_id = "
						+ "(SELECT position_id "
						+ "FROM dept_member "
						+ "WHERE member_id = ?)";
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setInt(1, memberId);
		ResultSet rs = stmt.executeQuery();
		
		rs.next();
		return rs;
	}
	
}
