package angular;
//package angular;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
//import java.util.Iterator;
import org.json.*;

import javax.servlet.ServletOutputStream;

import java.io.DataOutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Proxy extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private final String USER_AGENT = "Mozilla/5.0";   
    public Proxy() {
        super();
    }
	
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		//System.out.println(req.getHeader("url"));
		StringBuilder sb1 = new StringBuilder();
	    BufferedReader reader = req.getReader();
	    JSONObject j=null;
	    String a,b,c,d, u=null;
		//byte[] output;
		String out=null;
	    try {
	        String line;
	        while ((line = reader.readLine()) != null) {
	            sb1.append(line).append('\n');
	           
	        }
	        JSONObject jobj = new JSONObject(sb1.toString());
	        System.out.println(jobj);
	        reader.close();
	        System.out.println(sb1.toString());
	   
	
		//System.out.println(req);
		String iden= (String)jobj.get("iden");
		//System.out.println(jobj.get("userName"));
		//System.out.println(jobj.get("password"));
		
		switch (iden)
		{
		case "login":
			a=(String)jobj.get("userName");
			b=(String)jobj.get("password");
		    u="http://localhost:3000/api/login";
		   // output="{'userName':a}".getBytes("UTF-8");
		   // out="{userName:"+a+"password:"+b+"}";
		     j = new JSONObject();
		     j.put("userName", a);
		     j.put("password", b);
		  break;  
		case "logout":
			a=(String)jobj.get("userName");
			b=(String)jobj.get("access_token");
			//out="{access_token:"+b+"userName:"+a+"}";
			u="http://localhost:3000/api/logout";
			j = new JSONObject();
			j.put("userName",a);
			j.put("acess_token", b);
			break;
		case "search":
			a=(String)jobj.get("id");
			j = new JSONObject();
			j.put("id",a);
			u="http://localhost:3000/api/search";
			break;
		case "search1":
			a=(String)jobj.get("id");
			j = new JSONObject();
			j.put("id",a);
			u="http://localhost:3000/api/search1";
			break;
		case "search2":
			a=(String)jobj.get("id");
			j = new JSONObject();
			j.put("id",a);
			u="http://localhost:3000/api/search2";
			break;
		case "search3":
			a=(String)jobj.get("id");
			j = new JSONObject();
			j.put("id",a);
			u="http://localhost:3000/api/search3";
			break;
		case "search4":
			a=(String)jobj.get("id");
			j = new JSONObject();
			j.put("id",a);
			u="http://localhost:3000/api/search4";
			break;
		case "search5":
			a=(String)jobj.get("id");
			j = new JSONObject();
			j.put("id",a);
			u="http://localhost:3000/api/search5";
			break;
		case "search6":
			a=(String)jobj.get("id");
			j = new JSONObject();
			j.put("id",a);
			u="http://localhost:3000/api/search6";
			break;
		}
		//String user = req.getParameter("user");
		//String pass = req.getParameter("password");
		//if ("edu4java".equals(user) && "eli4java".equals(pass)) {
			//response(resp, "login ok");
		//} else {
			//response(resp, "invalid login");
		//}
		//JSONObject cred = new JSONObject();
} catch(Exception e) {
	        
	    }
	
		
		URL url;
		//String ur;
		HttpURLConnection connection =null;
		OutputStreamWriter osw;
	try{
	//String ur = "http://localhost:3000/api/";
    
    url = new URL(u);
     connection = (HttpURLConnection) url.openConnection();
     connection = (HttpURLConnection)url.openConnection();
     connection.setRequestMethod("POST");
     connection.setRequestProperty("Content-Type", 
          "application/json");
     
     connection.setUseCaches (false);
     connection.setDoInput(true);
     connection.setDoOutput(true);
       osw = new OutputStreamWriter(connection.getOutputStream());
       osw.write(j.toString());
       osw.close();
       StringBuilder sb = new StringBuilder();  

       int HttpResult =connection.getResponseCode(); 

       if(HttpResult ==HttpURLConnection.HTTP_OK){

           BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(),"utf-8"));  

           String line = null;  

           while ((line = br.readLine()) != null) {  
           sb.append(line + "\n");  
           }  

           br.close();  

           System.out.println(""+sb.toString());  
             response(resp , sb.toString());
       }else{
           System.out.println(connection.getResponseMessage());  
       }  
      
    }
    catch (Exception e)
    {
    	System.out.println(e);
    }
    //add reuqest header
    //con.setRequestMethod("POST");
    //con.setRequestProperty("User-Agent", USER_AGENT);
    //con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

	}
	
	private void response(HttpServletResponse resp, String msg)
			throws IOException {
		  resp.setContentType("application/json");
		resp.getWriter().write(msg);
		  //PrintWriter out = resp.getWriter();
		//out.println("<html>");
		//out.println("<body>");
		//out.println("<t1>" + msg + "</t1>");
		//out.println("</body>");
		//out.println("</html>");
	}
}