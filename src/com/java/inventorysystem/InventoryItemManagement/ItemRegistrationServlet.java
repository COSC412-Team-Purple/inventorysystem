package com.java.inventorysystem.InventoryItemManagement;

import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class ItemRegistrationServlet
 */

/* 
 WORKFLOW
 
 1.	insert item into items table -> return item_id
 2. insert record into item_quantity_updates (member_id, item_id, item_name, 0 <-(old_quant), quantity <-(updated_quant), todays date, "initial item registration", "register") -> returning update_id
 3. update inventory total set total_value = (total_value + (quantity * price)) where total_id = 1
 4. if category not in db -> insert into items_by_category (category, quantity, update_id)
 	else -> update items_by_category set items = (items + quantity), last_update_id = update_id where category = registeredCategory -> returning items
 5. if dept not in db -> insert into department (1 (sub_dept_id ?), departmentName)
 */
@WebServlet("/ItemRegistration")
public class ItemRegistrationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ItemRegistrationServlet() {
        super();
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
		// TODO Auto-generated method stub
		conn = DBConnectionUtility.getDatabaseConnection();

		int item_id = Integer.valueOf(request.getParameter("item_id"));
		String item_name = request.getParameter("item_name");
		String item_model = request.getParameter("item_model");
		double item_price = Double.valueOf(request.getParameter("item_price"));
		int item_quant = Integer.valueOf(request.getParameter("item_quant"));
		String item_loc = request.getParameter("item_loc");
		String dept_name = request.getParameter("dept_name");
		String item_category = request.getParameter("category");
		Date purchase_date = request.getDate("purchase_date");
		String item_brand = request.getParameter("item_brand");
		Text item_memo = request.getParameter("item_memo");

		System.out.println("ItemRegistration Servelt connecting to DB");

		JSONObject returnJson = new JSONObject();
		returnJson.put("item_name": item_name, "item_model": item_model, "item_price": item_price, "item_quant": item_quant, "item_loc": item_loc, "dept_name": dept_name, "category": item_category, "purchase_date": purchase_date, "item_brand": item_brand, "item_memo": item_memo);
		}

		try{
			if(!(boolean)isItemPresensent(item_name, item_model, item_price, item_quant, dept_name, item_category, item_date, item_brand)){
				if(!(boolean)isCategoryPresent(category)){
					Statement stmt = conn.createStatement();
					String addCategory = "INSERT INTO items_by_category (category, quantity, updating_id)" + "VALUES(?, ?, ?) RETURNING updating_id";
					PreparedStatement stmt = conn.prepareStatement(addCategory);
					stmt.setString(1, item_category);
					stmt.setInt(2, item_quant);
					stmt.setInt(3, updating_id);

					stmt.executeQuery(addCategory);
				}

				if(!(boolean)isDeptPresent(dept_name)){
					Statement stmt = conn.createStatement();
					String addDept = "INSERT INTO department (sub_dept_id, dept_name)" + "VALUES(?, ?)";
					PreparedStatement stmt = conn.prepareStatement(addDept);
					stmt.setInt(1, sub_dept_id);
					stmt.setString(2, dept_name);

					stmt.executeQuery(addDept);
				}

			Statement stmt = conn.createStatement();
			Sting item = request.getParameter("?,?,?,?,?,?,?,?");
			String query = "INSERT INTO items (item_name, item_model, item_price, item_quant, dept_name, category, purchase_date, item_brand, item_memo)" + "VALUES (?,?,?,?,?,?,?,?) RETURNING item_id";
			PreparedStatement stmt = conn.prepareStatement(query);
			stmt.setString(1, item_name);
			stmt.setString(2, item_model);
			stmt.setDouble(3, item_price);
			stmt.setInt(4, item_quant);
			stmt.setString(5, dept_name);
			stmt.setString(6, item_category);
			stmt.setDate(7, item_date);
			stmt.setString(8, item_brand);
			stmt.setString(9, item_memo);

			stmt.executeQuery(query);

			updateItemsByCategory(update_id, item_quantity, item_category);
			updateTotal(item_quantity, item_price);

			conn.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}

		

		doGet(request, response);
	}
	private boolean isItemPresent(String item_name, String item_model, Double item_price, Integer item_quant, String dept_name, String item_category, Date item_date, String item_brand) throws SQLException{
		String itemQuery = "SELECT * FROM items WHERE item_name = ? AND item_model = ? AND item_price = ? AND item_quant = ? AND category = ? AND item_date = ? AND item_brand = ?;";
		PreparedStatement stmt = conn.prepareStatement(itemQuery);
		stmt.setString(1, item_name);
		stmt.setString(2, item_model);
		stmt.setDouble(3, item_price);
		stmt.setInt(4, item_quant);
		stmt.setString(5, dept_name);
		stmt.setString(6, item_category);
		stmt.setDate(7, item_date);
		stmt.setString(8, item_brand);
		ResultSet itemSelect = stmt.executeQuery();
		boolean itemPresent = false;
		while(itemSelect.next()){
			itemPresent = true;
		}
		return itemPresent;
	}
	private boolean isCategoryPresent(String item_category) throws SQLException {
		String categoryQuery = "SELECT * FROM items_by_category WHERE category = ?;";
		PreparedStatement stmt = conn.prepareStatement(categoryQuery);
		stmt.setString(1, item_category);
		ResultSet categorySelect = stmt.executeQuery();
		boolean categoryPresent = false;
		while(categorySelect.next()) {
			categoryPresent = true;
		}
		return categoryPresent;
	}

	private boolean isDepartmentPresent(String dept_name) throws SQLException{
		String deptQuery = "SELECT * FROM items WHERE dept_name = ?";
		PreparedStatement stmt = conn.prepareStatement(deptQuery);
		stmt.setString(1, dept_name);
		ResultSet deptSelect = stmt.executeQuery();
		boolean deptPresent = false;
		while(deptSelect.next()){
			deptPresent = true;
		}
		return deptPresent;
	}
	
	private boolean updateItemsByCategory(int update_id, int item_quantity, String item_category) throws SQLException {
		String query = "SELECT items FROM items_by_category WHERE category = '" + item_category + "'";
		System.out.println(query);
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
		boolean success = false;
		
		if(rs.next())
		{
			int items = rs.getInt("items");
			query = "UPDATE items_by_category SET items = " + (items + item_quantity) + ", last_update_id = " + update_id + " WHERE category = '" + item_category + "'";
			System.out.println(query);
			stmt = conn.prepareStatement(query);
			int row = stmt.executeUpdate();
			
			success = (row == 1);
		}
		
		return success;
	}

	private boolean updateTotal(int item_quantity, double item_price) throws SQLException {
		
		String query = "SELECT total_value FROM inventory_total";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
		boolean success = false;
		
		if(rs.next())
		{
			float total = rs.getDouble("total_value");
			total = total + (item_quantity * item_price);
			query = "UPDATE inventory_total SET total_value = " + total + " WHERE total_id = 1";
			stmt = conn.prepareStatement(query);
			int row = stmt.executeUpdate();
			success = (row == 1);
		}
		
		return success;
	}

	
	
	//Build SQL statement for registering a new item to the DB
	private ResultSet registerNewItem(String name, int price, int quantity, String spec, String location, String dept, String category,  Date date, String brand, String note) throws SQLException {
		
		String query = "";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}

}
