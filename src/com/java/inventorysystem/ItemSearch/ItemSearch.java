package com.java.inventorysystem.ItemSearch;

import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Arrays;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.java.inventorysystem.Utilities.*;
/**
 * Servlet implementation class ItemSearch
 */

/*
WORKFLOW

1. build sql statement to select * from items where search parameters match, a queue for the parameter names and a queue for the parameter values may be a good idea
2. return data to client
*/
@WebServlet("/ItemSearch")
public class ItemSearch extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ItemSearch() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String item_name = request.getParameter("item_name");
		String category  = request.getParameter("item_category");
		String dept      = request.getParameter("item_dept");
		float priceMin   = Float.parseFloat(request.getParameter("item_price_min"));
		float priceMax   = Float.parseFloat(request.getParameter("item_price_max"));
		JSONArray jsonArray = new JSONArray();
			
		try {
			conn = DBConnectionUtility.getDatabaseConnection();
			
			ResultSet item_info = searchItem(item_name, category, dept, priceMin, priceMax);
			
			int hits = 0;
			
			while(item_info.next()) {
				JSONObject returnJson = new JSONObject();
				hits++;
			
				int itemID          = item_info.getInt("item_id");
				String itemName     = item_info.getString("item_name");
				float itemPrice     = item_info.getFloat("price");
				int itemQuantity    = item_info.getInt("item_quant");
				String itemModel    = item_info.getString("item_model");
				String itemLocation = item_info.getString("item_loc");
				String itemDept     = item_info.getString("dept_name");
				String itemCategory = item_info.getString("category");
				Date itemDate       = item_info.getDate("purchase_date");
				String itemBrand    = item_info.getString("item_brand");
				String itemText     = item_info.getString("item_memo");
				
				//Debug
				//System.out.println("ID  Name  Price  Quantity  Model  Locaiton  Dept  Category  Date  Brand  Text");
				//System.out.println(itemID + "  " + itemName + "  " + itemPrice + "  " + itemQuantity + "  " + itemModel + "  " + itemLocation + "  " + itemDept + "  " + itemCategory + "  " + itemDate + "  " + itemBrand + "  " + itemText);
				
				returnJson.put("item_id", itemID);
				returnJson.put("item_name", itemName);
				returnJson.put("price", itemPrice);
				returnJson.put("item_quant", itemQuantity);
				returnJson.put("item_model", itemModel);
				returnJson.put("item_loc", itemLocation);
				returnJson.put("dept_name", itemDept);
				returnJson.put("category", itemCategory);
				returnJson.put("purchase_date", itemDate.toString());
				returnJson.put("item_brand", itemBrand);
				returnJson.put("item_memo", itemText);
						
				jsonArray.add(returnJson);
			}
			
			ClientResponseUtility.writeToClient(response, jsonArray);
			response.setStatus(200);
			
			if(hits == 0) {
				response.sendError(400, "item not in DB");
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
		doGet(request, response);
	}
	
	//Build SQL statement for searching for an item in the DB
	private ResultSet searchItem(String name, String category, String dept, float priceMin, float priceMax) throws SQLException {
		
		String query = "SELECT * FROM items";
		String suffix = ""; 
		boolean AND = false;
		
		if(!name.isEmpty())
		{
			suffix += " item_name = '" + name + "'";
			AND = true;
		}
		
		//The html page drop-down must be either "any" or some pre-defined category
		//If it is "any" then ignore, otherwise include the specific category in the SQL
		if(!category.equals("any"))
		{
			if(AND)
			{
				suffix += " AND";
			}
			
			suffix += " category = '" + category + "'";
			AND = true;
		}
		
		//The html page drop-down must be either "any" or some pre-defined dept
		//If it is "any" then ignore, otherwise include the specific dept in the SQL
		if(!dept.equals("any"))
		{
			if(AND)
			{
				suffix += " AND";
			}
			
			suffix += " dept_name = '" + dept + "'";
			AND = true;
		}
			
		if( !(priceMin == 0.0 && priceMax == 0.0) && priceMin <= priceMax )
		{
			if(AND)
			{
				suffix += " AND";
			}
			
			//If both are 0 then ignore price condition
			suffix += " price >= " + priceMin + " AND price <= " + priceMax;
		}
		

		if(!suffix.isEmpty())
		{
			query += " WHERE" + suffix;
		}
		
		//Debug
		//System.out.println("Running Query: " + query);
		

		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}

}
