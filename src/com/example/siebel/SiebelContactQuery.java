package com.example.siebel;

import com.siebel.data.SiebelDataBean;
import com.siebel.data.SiebelException;
import com.siebel.data.SiebelPropertySet;

public class SiebelContactQuery {

    private static final String SIEBEL_SERVER = "siebel://localhost:2321/SBA_82/SCCObjMgr_enu";
    private static final String USERNAME = "SADMIN";
    private static final String PASSWORD = "SADMIN";
    private static final String LANGUAGE = "enu";

    public static void main(String[] args) {
        SiebelDataBean siebelDataBean = new SiebelDataBean();
        try {
            // Connect to Siebel
            siebelDataBean.login(SIEBEL_SERVER, USERNAME, PASSWORD, LANGUAGE);

            // Create a property set for the search criteria
            SiebelPropertySet searchSpec = new SiebelPropertySet();
            searchSpec.setProperty("Last Name", "Smith");

            // Execute the query
            siebelDataBean.setViewMode(3); // All view
            siebelDataBean.query("Contact", searchSpec, null);

            // Iterate through the results
            while (siebelDataBean.nextRecord()) {
                String firstName = siebelDataBean.getFieldValue("First Name");
                String lastName = siebelDataBean.getFieldValue("Last Name");
                System.out.println("Contact: " + firstName + " " + lastName);
            }

        } catch (SiebelException e) {
            e.printStackTrace();
        } finally {
            try {
                siebelDataBean.logoff();
            } catch (SiebelException e) {
                e.printStackTrace();
            }
        }
    }
}
