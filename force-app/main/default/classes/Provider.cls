public class Provider {

    @AuraEnabled
    public static List<Provider__c> getProviders(String name, String gender, String inNetwork, String taxonomy, DateTime startTime, DateTime endTime, String distance, List<String> specialities, String location){

        System.debug(name+' '+gender+' '+inNetwork+' '+taxonomy+' '+startTime+' '+endTime+' '+distance+' '+specialities+' '+location);
        String query;
        String condition = (String.isNotBlank(name) ? 'Provider_Name__c LIKE \'' + '%' + name + '%\'' : '');

        condition += (String.isNotBlank(gender)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Gender__c = \'' +
            gender +
            '\''
        : '');  

        condition += (String.isNotBlank(inNetwork)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' In_Network__c = \'' +
            inNetwork +
            '\''
        : '');
        

        condition += (startTime != null
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Start_Time__c >= ' +
            startTime : '');

        condition += (endTime != null
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' End_Time__c >= ' +
            endTime : '');       


        condition += (String.isNotBlank(taxonomy)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Taxonomy__c LIKE \'' +
            '%' +
            taxonomy +
            '%\''
        : '');


        condition += (String.isNotBlank(location)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Location__c LIKE \'' +
            '%' +
            location +
            '%\''
        : '');

        condition += (String.isNotBlank(distance)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Distance__c = \'' +
            distance +
            '\''
        : '');

        System.debug('condition '+condition);
        if (String.isNotBlank(condition)) {
            query = 'SELECT Id, Gender__c, In_Network__c, Start_Time__c, End_Time__c, Speciality__c, Taxonomy__c, Location__c, Distance__c, Provider_Name__c FROM Provider__c WHERE ' +
                condition+' ORDER BY Provider_Name__c';

        } else {
            query = 'SELECT Id, Gender__c, In_Network__c, Start_Time__c, End_Time__c, Speciality__c, Taxonomy__c, Location__c, Distance__c, Provider_Name__c FROM Provider__c LIMIT 200';
        }
        System.debug(query);
        List<Provider__c> records = Database.query(query);
        List<String> providerIds = new List<String>();
        for(Provider__c i : records){
            providerIds.add(i.Id);
        }
        
        if(specialities.size()>0){
            System.debug('==');
            for(Provider__c i: [SELECT Id, Gender__c, In_Network__c, Start_Time__c, End_Time__c, Speciality__c, Taxonomy__c, Location__c, Distance__c, Provider_Name__c FROM Provider__c]){
                for(String j : specialities){
                    if(i.Speciality__c.contains(j) && providerIds.contains(i.Id)==false){
                        providerIds.add(i.Id);
                        records.add(i);
                    }
                }
            }
        }
        return records;

    }

}
