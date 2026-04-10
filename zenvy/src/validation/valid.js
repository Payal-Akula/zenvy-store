export function uphone(aphone) {
    // Phone validation regex (matches Indian phone numbers)
    const phoneRegexp =  /^(?:(?:\+|0{0,2})91(\s*[ -]\s*)?|[0]?)?[6789]\d{9}$/;
   

   
    if (phoneRegexp.test(aphone)) {
        console.log("Valid phone number");
        return true;
    } else {
        console.log("Invalid input");
        return false; 
    }
}
export function uemail(aemail){
 // Email validation regex
    const emailRegexp = /^[a-z0-9._%+-]+@gmail\.com$/;
     if (emailRegexp.test(aemail)) {
        console.log("Valid email");
        return true; 
       
    } 
     else{
            console.log("invalid")
            return false
        }
}
export function upassword(apassword) {
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
    var result = regex.test(apassword)
    console.log(result)
    return result
}
export function uname(aname) {
    var regex = /^[a-zA-Z]+([-'\s][a-zA-Z]+)*$/
    var result = regex.test(aname)
    console.log(result)
    return result
}