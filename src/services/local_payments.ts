

export class LocalPaymentsService {

    static getDarajaToken = async ()=> {
  
        try {
            const secret = process.env.SAFARICOM_SECRET_KEY
            const consumer = process.env.SAFARICOM_CONSUMER_KEY
            //   @ts-ignore
            const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");
      
            const requuestResult = await fetch(
                "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
                {
                method: "GET",
                headers: {
                    authorization: `Basic ${auth}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                }
            )
        
            console.log("requuestResult ", requuestResult);
            const data = await requuestResult.json()
            console.log("data ", data);
            const token = data?.access_token
        
            return token
        } catch (error) {
        
            console.log("error ", error);
            return null
        }
    }


    static initiatePayment  = async ({ amount, phone, serverUrl = "", })=> {
        const token = await LocalPaymentsService.getDarajaToken()

        if( !token ) return { success: false }

        try {
            
            const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

            // till no or paybill
            const shortCode = process.env.SAFARICOM_SHORT_CODE
            const passKey = "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjMwODIwMTkwNTAz"

            const date = new Date();
            const timestamp =
                date.getFullYear() +
                ("0" + (date.getMonth() + 1)).slice(-2) +
                ("0" + date.getDate()).slice(-2) +
                ("0" + date.getHours()).slice(-2) +
                ("0" + date.getMinutes()).slice(-2) +
                ("0" + date.getSeconds()).slice(-2);

            // @ts-ignore
            const password = new Buffer.from(shortCode.toString() + passKey + timestamp).toString(
                "base64"
            );

            const data = {
                "BusinessShortCode": shortCode,
                "Password": passKey,
                // "Password": password,
                "Timestamp": "20230820190503",

                // CustomerPayBillOnline for paybill
                // CustomerBuyGoodsOnline for till
                // "TransactionType": "CustomerPayBillOnline",
                "TransactionType": "CustomerBuyGoodsOnline",
                "Amount": amount,
                "PartyA": phone,
                "PartyB": shortCode,
                "PhoneNumber": phone,
                "CallBackURL": `${serverUrl}/payment-confirmation`,
                "AccountReference": "Auto Spot LTD",
                "TransactionDesc": "Payment of Items" 
            }

            const requestResult = await fetch(
                url,
                {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            )

            const resultData = await requestResult.json()

            return {
                success: true,
                resultData,
            }
        } catch (error) {
            
            console.log("error ", error);
            return { success: false }
        }
    }


}
