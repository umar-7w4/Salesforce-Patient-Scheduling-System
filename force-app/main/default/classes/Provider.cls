/**
* @author: Mohammad Umar        
* @version: 1          
* @description: This class returns all provider related details from provider object. 
**/

public class Provider {

    /*
    This methods gets all provider records based on the fields provided inside the parameters
    Search mechanism is flexible enough to get all records that matches one or more fields. 
    If none of the field matches it then returns all records with limit of 200
    */

    @AuraEnabled
    public static List<Provider__c> getProviders(String firstName, String lastName, String gender, String inNetwork, String taxonomy, DateTime startTime, DateTime endTime, String distance, String speciality, String location){

        System.debug(firstName+' '+lastName+' '+gender+' '+inNetwork+' '+taxonomy+' '+startTime+' '+endTime+' '+distance+' '+speciality+' '+location);
        String query;

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

        //Condition to check gender picklist value
        condition += (String.isNotBlank(gender)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Gender__c = \'' +
            gender +
            '\''
        : '');  

        //Condition to check In network picklist value
        condition += (String.isNotBlank(inNetwork)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' In_Network__c = \'' +
            inNetwork +
            '\''
        : '');

        //Condition to check taxonomy value
        condition += (String.isNotBlank(taxonomy)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Taxonomy__c LIKE \'' +
            '%' +
            taxonomy +
            '%\''
        : '');

        //Condition to check location value
        condition += (String.isNotBlank(location)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Location__c LIKE \'' +
            '%' +
            location +
            '%\''
        : '');

        //Condition to check distance value
        condition += (String.isNotBlank(distance)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Distance__c = \'' +
            distance +
            '\''
        : '');

        //Updating query that fetches all required fields order by name with limit of 200 records
        System.debug('condition '+condition);
        if (String.isNotBlank(condition)) {
            query = 'SELECT Id, First_Name__c, Last_Name__c, Gender__c, In_Network__c, Start_Time__c, End_Time__c, Speciality__c, Taxonomy__c, Location__c, Distance__c, Provider_Name__c FROM Provider__c WHERE ' +
                condition+' ORDER BY Provider_Name__c';

        } else if(speciality == null){
            query = 'SELECT Id,  First_Name__c, Last_Name__c, Gender__c, In_Network__c, Start_Time__c, End_Time__c, Speciality__c, Taxonomy__c, Location__c, Distance__c, Provider_Name__c FROM Provider__c LIMIT 200';
        }
        System.debug(query);

        //Executing query and storing records inside a list
        List<Provider__c> records = new List<Provider__c>();
        if(query != null){
            try{
                records = Database.query(query);
            }
            catch(Exception e){
                System.debug(e.getMessage());
            }
        }
        List<String> providerIds = new List<String>();
        if(records.size()>0){
            for(Provider__c i : records){
                providerIds.add(i.Id);
            }
        }
        
        /*
        Checking whether speciality value inside parameters is null or not. 
        If not null then adding provider records with speciality inside the output list
        */

        if(speciality != null){
            System.debug('==');
            for(Provider__c i: [SELECT Id, Gender__c, In_Network__c, Start_Time__c, End_Time__c, Speciality__c, Taxonomy__c, Location__c, Distance__c, Provider_Name__c FROM Provider__c]){
                List<String> specialities = new List<String>();
                specialities.addAll(i.Speciality__c.split(';'));
                if(specialities.contains(speciality) && providerIds.contains(i.Id)==false){
                    providerIds.add(i.Id);
                    records.add(i);
                    System.debug('-');
                    System.debug(specialities);
                }
            }
        }

        return records;

    }

}
