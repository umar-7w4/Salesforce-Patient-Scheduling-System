/**
* @author: Mohammad Umar        
* @version: 1          
* @description: This class returns all appoitment related details from Appoitment object. 
**/

public with sharing class Appointment {

    /*
    These methods gets all appoitment records based on the fields provided inside the parameters
    Search mechanism is flexible enough to get all records that matches one or more fields. 
    If none of the field matches it then returns all records with limit of 200
    */

    @AuraEnabled
    public static List<Appointment__c> getAppointments(String dayOfTheWeek, DateTime startTime, DateTime endTime, String distance, String location){

        String query;

        //Intial condition to check day of the week value
        String condition = (String.isNotBlank(dayOfTheWeek) ? 'Days_of_the_week__c LIKE \'' + '%' + dayOfTheWeek + '%\'' : '');

        //Condition for checking start time with format
        condition += (startTime != null
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            '( Start_Time__c >= ' +
            startTime.formatGMT('yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') : '');

        //Condition for checking end time with format
        condition += (endTime != null
        ? (String.isNotBlank(condition) ? +' AND ' : '') +
            ' End_Time__c <= ' +
            endTime.formatGMT('yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') +' )' : '');         

        //Condition for checking distance picklist value
        condition += (String.isNotBlank(distance)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Distance__c = \'' +
            distance +
            '\''
        : '');

        //Condition for checking location value 
        condition += (String.isNotBlank(location)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Location__c LIKE \'' +
            '%' +
            location +
            '%\''
        : '');

        //Updating query that fetches all required fields order by first name with limit of 200 records
        System.debug('condition '+condition);
        if (String.isNotBlank(condition)) {
            query = 'SELECT Id, Name, Provider__c, Account__c, First_Name__c, Last_Name__c, Days_of_the_week__c, Location__c, Distance__c, Appointment_Start_Time__c, Appointment_End_Time__c, First_Available__c FROM Appointment__c WHERE ' +
                condition+' ORDER BY First_Name__c';

        } else {
            query = 'SELECT Id, Name, Provider__c, Account__c, First_Name__c, Last_Name__c, Days_of_the_week__c, Location__c, Distance__c, Appointment_Start_Time__c, Appointment_End_Time__c, First_Available__c FROM Appointment__c LIMIT 200';
        }
        System.debug(query);

        //Executing query and storing records inside a list
        List<Appointment__c> records = new List<Appointment__c>();
        if(query != null){
            try{
                records = Database.query(query);
            }
            catch(Exception e){
                System.debug(e.getMessage());
            }
        }

        return records;
    }

    @AuraEnabled
    public static List<Appointment__c> getAppointmentsForProviderCentric(String firstName, String lastName, String taxonomy, String dayOfTheWeek, DateTime startTime, DateTime endTime, String distance, String blocksOfTime, String location){

        String query;

        System.debug(firstName+' '+lastName);
        //Intial condition to check first name of the patient
        String condition = (String.isNotBlank(firstName) ? 'First_Name__c LIKE \'' + '%' + firstName + '%\'' : '');

        //Condition to check last name of the patient
        condition += (String.isNotBlank(lastName)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Last_Name__c LIKE \'' +
            '%' +
            lastName +
            '%\''
        : '');

        //Condition to check taxonomy value
        condition += (String.isNotBlank(taxonomy)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Taxonomy__c LIKE \'' +
            '%' +
            taxonomy +
            '%\''
        : '');

        //Condition to check day of the week value
         condition += (String.isNotBlank(dayOfTheWeek)
         ? (String.isNotBlank(condition) ? +' OR ' : '') +
             ' Days_of_the_week__c LIKE \'' +
             '%' +
             dayOfTheWeek +
             '%\''
         : '');

        //Condition for checking start time with format
        condition += (startTime != null
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            '( Start_Time__c >= ' +
            startTime.formatGMT('yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') : '');

        //Condition for checking end time with format
        condition += (endTime != null
        ? (String.isNotBlank(condition) ? +' AND ' : '') +
            ' End_Time__c <= ' +
            endTime.formatGMT('yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') +' )' : '');         

        //Condition for checking distance picklist value
        condition += (String.isNotBlank(distance)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Distance__c = \'' +
            distance +
            '\''
        : '');

        //Condition for checking blocks of time picklist value
        condition += (String.isNotBlank(blocksOfTime)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Blocks_of_time__c = \'' +
            blocksOfTime +
            '\''
        : '');

        //Condition for checking location value 
        condition += (String.isNotBlank(location)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Location__c LIKE \'' +
            '%' +
            location +
            '%\''
        : '');

        //Updating query that fetches all required fields order by first name with limit of 200 records
        System.debug('condition '+condition);
        if (String.isNotBlank(condition)) {
            query = 'SELECT Id, Name, Provider__c, Account__c, First_Name__c, Last_Name__c, Days_of_the_week__c, Location__c, Distance__c, Appointment_Start_Time__c, Appointment_End_Time__c, First_Available__c FROM Appointment__c WHERE ' +
                condition+' ORDER BY First_Name__c';

        } else {
            query = 'SELECT Id, Name, Provider__c, Account__c, First_Name__c, Last_Name__c, Days_of_the_week__c, Location__c, Distance__c, Appointment_Start_Time__c, Appointment_End_Time__c, First_Available__c FROM Appointment__c LIMIT 200';
        }
        System.debug(query);

        //Executing query and storing records inside a list
        List<Appointment__c> records = new List<Appointment__c>();
        if(query != null){
            try{
                records = Database.query(query);
            }
            catch(Exception e){
                System.debug(e.getMessage());
            }
        }

        return records;
    }
}
