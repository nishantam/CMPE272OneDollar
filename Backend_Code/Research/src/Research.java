import java.io.ByteArrayInputStream;

import com.ibm.nosql.bson.types.ObjectId;
import com.ibm.nosql.json.api.BasicDBList;
import com.ibm.nosql.json.api.BasicDBObject;
import com.ibm.nosql.json.api.DB;
import com.ibm.nosql.json.api.DBCollection;
import com.ibm.nosql.json.api.DBCursor;
import com.ibm.nosql.json.api.DBObject;
import com.ibm.nosql.json.api.NoSQLClient;
import com.ibm.nosql.json.cmd.NoSqlCmdLine;

public class Research {
	
	public static void main(String [] args) throws Exception
	{
		
	String USER_NAME =     "db2admin";
	String PASSWORD  =     "root1234";
	String DBNAME    =     "acmeair";
	String DB_HOST_NAME =  "localhost";
	int PORT_NO   =      50002;

	
 		///database connection.i.e connecting through database url fetching entire db "acmeair" in an db2 object .
    	String DB_URL = "jdbc:db2://" + DB_HOST_NAME + ":" + PORT_NO + "/" + DBNAME;
    	DB Database = NoSQLClient.getDB(DB_URL, USER_NAME, PASSWORD,"research");
    	//testing database connection
    	DBCollection dtc1 = Database.getCollection("JMD1");
    	dtc1.drop();
    	dtc1.insert("{\"name\":\"JMD1\"}");
    	System.out.println(dtc1.find().next());

    	
    	//creating a nosql collection(db) to store json documents
    	DBCollection dtc = Database.getCollection("xcollectible");
    	dtc.drop();
    	
    	//command to import json file into (collection)db name xcollectible
    	String cmd ="use research \r"+ 
    			    "db.xcollectible.importFile(\"C:/JSON_Project/Research/json data files/collectible.json\",200) ";
		
    	//setup up the execution enviorment
    	ByteArrayInputStream commands = new ByteArrayInputStream(cmd.getBytes());
		int executionCode = 0;
		String[] cmdlineArgs = { "--url", "jdbc:db2://localhost:50002/acmeair", "--user", "db2admin", "--password", "root1234" };
		NoSqlCmdLine.processCmdLineArgs(cmdlineArgs);
		
		//executing the command
		executionCode = NoSqlCmdLine.executeCmdLine(cmdlineArgs, commands);
		//if the command gets executed successfully,the output return should be zero.
		System.out.println(executionCode);
        
		//initializing NoSQL objects.
		BasicDBObject dbobj = new BasicDBObject();
        BasicDBObject searchResult = new BasicDBObject();
        BasicDBList item = new BasicDBList();
        
          Object obj_id = dtc.find().next().getID();
          System.out.println(obj_id);
        
          //Fetching the json document from the data,imported earlier 
          dbobj = (BasicDBObject) ((BasicDBList) dtc.find().next().get("findItemsByKeywordsResponse")).get(0);      
          searchResult = (BasicDBObject) ((BasicDBList)dbobj.get("searchResult")).get(0);
        item = (BasicDBList) searchResult.get("item");        
        System.out.println(item.size());
        //creating a new collection which will hold the sorted json document. 
         DBCollection dtc_new = Database.getCollection("research_output");
         dtc_new.drop();
         BasicDBList dblist_new = new BasicDBList();
         
         //Traversing through the document to get all the items and store them in the separate documents. i.e created and stored one document for each item.
     for(int i = 0; i<item.size(); i++)
         {
             BasicDBList xsellingStatus = new BasicDBList();
             BasicDBList xcurrentPrice = new BasicDBList();
             String xcurrencyId = " ";
             double x__value__ = 0.0;
         
         xsellingStatus=   (BasicDBList) ((BasicDBObject) item.get(i)).get("sellingStatus");         
         xcurrentPrice =  (BasicDBList)  ( (BasicDBObject) (xsellingStatus.get(0))).get("currentPrice");
         xcurrencyId =  ((BasicDBObject)xcurrentPrice.get(0)).get("@currencyId").toString();
         x__value__ =  Double.parseDouble(((BasicDBObject)xcurrentPrice.get(0)).get("__value__").toString());

         
         BasicDBList xitemid  = (BasicDBList) ((BasicDBObject) item.get(i)).get("itemId");
         BasicDBList xtitle  = (BasicDBList) ((BasicDBObject) item.get(i)).get("title");
         BasicDBList xgalleryURL = null ;
           if(((BasicDBObject)item.get(i)).get("galleryURL")!=null)
            xgalleryURL  = (BasicDBList) ((BasicDBObject) item.get(i)).get("galleryURL");
           BasicDBList xviewItemURL  =  (BasicDBList) ((BasicDBObject) item.get(i)).get("viewItemURL");
           BasicDBList xlocation  =(BasicDBList) ((BasicDBObject) item.get(i)).get("location");
     
//        System.out.println(xitemid);
//        System.out.println(xtitle);
//        System.out.println(xgalleryURL);
//        System.out.println(xviewItemURL);
//        System.out.println(xlocation);


         BasicDBObject xdbobj = new BasicDBObject();
         
         xdbobj.append("itemid", xitemid)
               .append("title", xtitle)
               .append("galleryURL", xgalleryURL)
               .append("viewItemURL", xviewItemURL)
               .append("location", xlocation)
               .append("price", x__value__);

       
         dtc.insert(xdbobj);
       //  dblist_new.add(xdbobj);

         }
       
     
     //performing the sorting function on the documnets w.r.t to there price attribute 
     //and saving the sorted documnets list in the "research_output" collection created earlier.
     DBCursor cursor = dtc.find().sort(new BasicDBObject("price",1));
     while(cursor.hasNext())
     {   
    	  DBObject temp_obj = cursor.next();
       if(!temp_obj.getID().equals(obj_id))
    	 dblist_new.add(temp_obj);
     }
          System.out.println(dblist_new.size());
          dtc_new.insert(new BasicDBObject("results",dblist_new));
         System.out.println(dtc_new.find().next());

         //Creating a json file and exporting the "research_output" collection contining the final sorted items.
         dtc_new.exportFile("C:/JSON_Project/Research/json data files/collectible_results_sorted_by_price.json");
    	System.out.println(dtc.find(new BasicDBObject("price",0.99)).count());
	}



}
