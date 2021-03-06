package com.java.inventorysystem.Utilities;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.io.IOException;
import javax.servlet.http.HttpServletResponse;

public class ClientResponseUtility{
	public static void writeToClient(HttpServletResponse response, JSONObject responseJson) throws IOException {
		System.out.println(responseJson.toJSONString());
		response.getWriter().write(responseJson.toJSONString());
	}
	
	public static void writeToClient(HttpServletResponse response, JSONArray responseJsonArray) throws IOException {
		System.out.println(responseJsonArray.toJSONString());
		response.getWriter().write(responseJsonArray.toJSONString());
	}
	
	public static void writeToClient(HttpServletResponse response, String responseString) throws IOException {
		response.getWriter().write(responseString);
	}
}
