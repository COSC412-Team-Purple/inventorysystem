package com.java.inventorysystem.RoleManagement;

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

import org.json.simple.JSONObject;

import com.java.inventorysystem.Utilities.*;

/**
 * Servlet implementation class SearchMember
 */

/*
WORKFLOW

1. 
	select member_id, fname, lname from member where member_id = id 
	
	OR
	
	select member_id, fname, lname from member where fname = fname AND lname = lname

2. select dept_id, position_id, start_date, end_date from dept_member where member_id = member_id
3. select name_dept from department where dept_id = dept_id
4. select name_pos from member_pos where position_id = position_id
5. return member_id, fname, lname, dept_id, start_date, name_dept, name_pos  to client
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

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		conn = DBConnectionUtility.getDatabaseConnection();
		System.out.println("Get member servlet connecting to DB");
		int member_id = Integer.valueOf(request.getParameter("member_id"));
		String member_fname = request.getParameter("member_fname");
		String member_lname = request.getParameter("member_lname");
		try {
			JSONObject returnJson = new JSONObject();
			ResultSet memberResult = this.searchMember(member_id, member_fname, member_lname);
			int hits = 0;
			while(memberResult.next()) {
				hits++;
				member_id = memberResult.getInt("member_id");
				returnJson.put("member_id", member_id);
				returnJson.put("member_fname", memberResult.getString("fname"));
				returnJson.put("member_lname", memberResult.getString("lname"));
			}
			
			if(hits != 0) {
				ResultSet deptMemberResults = this.getMemberDeptMemberInfo(member_id);
				int dept_id = 0;
				int position_id = 0;
				while(deptMemberResults.next()) {
					dept_id = deptMemberResults.getInt("dept_id");
					returnJson.put("member_start_date", deptMemberResults.getDate("start_date").toString());
					
					Date end = deptMemberResults.getDate("end_date");
					if(end != null) {
						returnJson.put("member_end_date", end.toString());
					}else {
						returnJson.put("member_end_date", null);
					}
				}
				
				ResultSet roleResults = this.getMemberRole(member_id);
				while(roleResults.next()) {
					position_id = roleResults.getInt("position_id");
				}
				
				
				if(dept_id != 0) {
					ResultSet deptResults = this.getDeptInfo(dept_id);
					ResultSet positionResults = this.getPositionName(position_id);
					
					while(deptResults.next()) {
						returnJson.put("member_dept", deptResults.getString("name_dept"));
					}
					
					while(positionResults.next()) {
						returnJson.put("member_role", positionResults.getString("name"));
					}
				}else {
					returnJson.put("member_start_date", "");
					returnJson.put("member_end_date", "");
					returnJson.put("member_dept", "");
					returnJson.put("member_role", "");
				}
			}else {
				returnJson.put("member_id", 0);
			}
			


			ClientResponseUtility.writeToClient(response, returnJson);
			response.setStatus(200);
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
			response.sendError(400, "error finding inventory total and items by category data");
		}
	}
	
	//Build SQL statement for searching for a member
	private ResultSet searchMember(int member_id, String member_fname, String member_lname) throws SQLException {
		
		String query = "SELECT member_id, fname, lname FROM member WHERE member_id = ? OR (fname = ? AND lname = ?) ;";
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setInt(1, member_id);
		stmt.setString(2, member_fname);
		stmt.setString(3, member_lname);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}
	
	private ResultSet getMemberDeptMemberInfo(int member_id) throws SQLException {
		
		String query = "SELECT dept_id, start_date, end_date FROM dept_member WHERE member_id = ?;";
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setInt(1, member_id);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}
	
	private ResultSet getDeptInfo(int dept_id) throws SQLException {
		
		String query = "SELECT name_dept FROM department WHERE dept_id = ?;";
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setInt(1, dept_id);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}
	
	private ResultSet getPositionName(int position_id) throws SQLException {
		
		String query = "SELECT name FROM position WHERE position_id = ?;";
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setInt(1, position_id);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}
	
	private ResultSet getMemberRole(int member_id) throws SQLException {
		
		String query = "SELECT position_id FROM role WHERE member_id = ?;";
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setInt(1, member_id);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}

}
