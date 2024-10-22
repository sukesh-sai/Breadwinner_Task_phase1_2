import { LightningElement, wire,api,track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import processInvoiceApex from '@salesforce/apex/CreateInvoice.sendInvoiceDateToXero';

export default class InvoicePage extends NavigationMixin(LightningElement) {
    @track originRecordId;
   @track  account;
    @track invoiceDate;
    @track invoiceDueDate;
    @track childRelationshipName;
    @track lineItemDescription;
    @track lineItemQuantity;
    @track lineItemUnitPrice;
@api origin_record;
displayFormat = false;
hideTable = false;
@track jsonFormat;

    // Get current page reference (URL parameters)
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            const urlParams = currentPageReference.state;

            this.originRecordId = urlParams.c__origin_record;
            this.account = urlParams.c__account;
            this.invoiceDate = urlParams.c__invoice_date;
            this.invoiceDueDate = urlParams.c__invoice_due_date;
            this.childRelationshipName = urlParams.c__child_relationship_name;
            //console.log('child'+this.childRelationshipName);
            this.lineItemDescription = urlParams.c__line_item_description;
            this.lineItemQuantity = urlParams.c__line_item_quantity;
            this.lineItemUnitPrice = urlParams.c__line_item_unit_price;
            this.hideTable = true;
            console.log('recordId'+this.originRecordId, 'account'+this.account,'Invoice Date'+this.invoiceDate,'Invoice Due Date'+this.invoiceDueDate);
        }
    }

    showFormat(){
        this.displayFormat = true;
        this.hideTable =  false;
        this.createJSON();
        //this.callXero();
    }
 

   createJSON(){

    let json = '{"Type": "ACCREC","Contact": {  "ContactID": "000000" },"LineAmountTypes": "Exclusive",';
        json+= '"Date": "'+this.invoiceDate+'",';
        json+= '"DueDate": "'+this.invoiceDueDate+'",';
    json+= '"LineItems": [{';
    json+=' "Description": "'+this.lineItemDescription+'",';
    json+=  '"Quantity": "'+this.lineItemQuantity+'",';
    json+=  '"UnitAmount": "'+this.lineItemUnitPrice+'",';
    json+=  '"AccountCode": "20",';
    json+= '"DiscountRate": "20" }]}';
    this.jsonFormat = json;
   }   

   callXero(){
        processInvoiceApex({json : this.jsonFormat})
        .then((result) => {
            if(result === 'Data send to Xero'){
                alert('Success');
            }else{
                alert(result);
            }    
        }).catch((err) => {
            alert(err)
        });
   }


    navigateToLWC() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'CreateInvoice' // Your app or tab name
            }
        });
    }

    navigateToRecordId() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId:  this.originRecordId,
                objectApiName: 'Invoice__c',
                actionName: 'view'
            }
        });
    }

}