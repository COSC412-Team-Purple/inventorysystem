package com.java.inventorysystem.RoleManagement;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import com.java.inventorysystem.Utilities.ClientResponseUtility;
import com.java.inventorysystem.Utilities.DBConnectionUtility;

/**
 * Servlet implementation class CreateRole
 */

/*
WORKFLOW

1. insert into member_pos (name, permissions) -> returning position_id
2. return position_id, name, permissions in json to client
*/
@WebServlet("/CreateRole")
public class CreateRole extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CreateRole() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		conn = DBConnectionUtility.getDatabaseConnection();
		String roleName = request.getParameter("roleName");
		String permissions = request.getParameter("perms");
		
		JSONObject returnJson = new JSONObject();
		try {
			//query for
			ResultSet roleResult = this.createRoleInDB(roleName, permissions);
			
			
			while(roleResult.next()) {
				returnJson.put("roleName", roleName);
				returnJson.put("roleId", roleResult.getInt("position_id"));
				returnJson.put("perms", Arrays.toString(permissions.split(",")));
				ClientResponseUtility.writeToClient(response, returnJson);
				response.setStatus(200);
			}
		

			conn.close();
		} catch (SQLException e) {
			response.sendError(400, "An error occurred");
			e.printStackTrace();
		}
	}
	
	private ResultSet createRoleInDB(String roleName, String permissions) throws SQLException {		
		String updateSql = "INSERT INTO member_pos (name_pos, perms)"
							+ "VALUES (?,?) "
							+ "RETURNING position_id";
		PreparedStatement stmt = conn.prepareStatement(updateSql);
		stmt.setString(1, roleName);
		stmt.setString(2, permissions);
		ResultSet results = stmt.executeQuery();
		
		return results;
	}

}
