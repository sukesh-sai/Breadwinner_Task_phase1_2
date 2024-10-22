public class CreateInvoice {
    @AuraEnabled(cacheable = false)
    public static sObject createInvoiceFromLineItem(Id recordId, 
                                                    String invoiceDate,
                                                    String invoiceDueDate, 
                                                    String childRelationshipName, 
                                                    String lineItemDescription, 
                                                    String lineItemQuantity, 
                                                    String lineItemUnitPrice){
                                                        Schema.SObjectType record = recordId.getsobjecttype();
                                                        String objName = record.getDescribe().getName();
                                                        
                                                        String childQuery = '(Select Id,' + lineItemDescription +','+ lineItemQuantity +','+ lineItemUnitPrice +' from '+ childRelationshipName +')';
                                                        String parentQuery = 'select Id,'+invoiceDate+','+invoiceDueDate+','+childQuery+' from ' + objName + ' where Id =: recordId';
                                                        sObject obj= Database.query(parentQuery);
                                                        return obj;
                                                    }

 @AuraEnabled(cacheable=false)
 public static String sendInvoiceDateToXero(String json){
    try{
        HTTPRequest req = New HTTPRequest();
        HTTPResponse res = New HttpResponse();
        req.setEndPoint('https://api.xero.com/api.xro/2.0/Invoices'); // This can be made dynamic by adding in custommeta data or custom label or named credentials
        req.setMethod('POST');
        req.setBody(json);
        req.setHeader('Content-Type','application/json');
        req.setHeader('Accept','application/json');
        Http ht = New Http();
        res = ht.send(req);
        if(res.getStatusCode() == 200){
            return 'Data send to Xero';
        }else{
            return res.getBody();
        }

    }catch(Exception ex){
        return ex.getMessage();
    }
 }

}