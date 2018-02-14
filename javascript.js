var REST_DATA = 'api/favorites';

function check() {
  //alert("Na funçao CHECK");
  var check = valida();
  //alert("Passou da valida " + check);
  if (check) {
      saveChange(document.formNewReq);
      }
  return check;
}

function saveChange(dado) {
//  alert("Na saveChange");

  var data = {
              reqType: dado.fType.value,
              UpdateListDisplay1: dado.fUpdateListDisplay1.value,
              LineofBusiness: dado.fLineofBusiness.value,
              UpdateBT: dado.fUpdateBT.value,
              NewBT: dado.fNewBT.value,
              fBusinessTitle: dado.fBusinessTitle.value,
              ftBTJustification: dado.ftBTJustification.value,
              fCompetencySegment: dado.fCompetencySegment.value,
              fBTStatus: dado.fBTStatus.value,
              fNATOP: dado.fNATOP.value,
              fDivCost: dado.fDivCost.value,
              fMajCost: dado.fMajCost.value,
              fMinorCost: dado.fMinorCost.value,
              fSubMinorCost: dado.fSubMinorCost.value,
              fLeruCost: dado.fLeruCost.value,
              fDivContractorCost: dado.fDivContractorCost.value,
              fMajContractorCost: dado.fMajContractorCost.value,
              fMinorContractorCost: dado.fMinorContractorCost.value,
              fSubContractorMinorCost: dado.fSubContractorMinorCost.value,
              fLeruContractorCost: dado.fLeruContractorCost.value,
              fDivRevenue: dado.fDivRevenue.value,
              fMajRevenue: dado.fMajRevenue.value,
              fMinorRevenue: dado.fMinorRevenue.value,
              fSubMinorRevenue: dado.fSubMinorRevenue.value,
              fLeruRevenue: dado.fLeruRevenue.value,
              fDivEarlyRevenue: dado.fDivEarlyRevenue.value,
              fMajEarlyRevenue: dado.fMajEarlyRevenue.value,
              fMinoEarlyrRevenue: dado.fMinoEarlyrRevenue.value,
              fSubEarlyMinorRevenue: dado.fSubEarlyMinorRevenue.value,
              fLeruEarlyRevenue: dado.fLeruEarlyRevenue.value,
              fDivTax: dado.fDivTax.value,
              fMajTax: dado.fMajTax.value,
              fMinorTax: dado.fMinorTax.value,
              fSubMinorTax: dado.fSubMinorTax.value,
              fLeruTax: dado.fLeruTax.value,
              fDivEarlyTax: dado.fDivEarlyTax.value,
              fMajEarlyTax: dado.fMajEarlyTax.value,
              fMinorEarlyTax: dado.fMinorEarlyTax.value,
              fSubMinorEarlyTax: dado.fSubMinorEarlyTax.value,
              fEarlyLeruTax: dado.fEarlyLeruTax.value,
              fDivExpenses: dado.fDivExpenses.value,
              fMajExpenses: dado.fMajExpenses.value,
              fMinorExpenses: dado.fMinorExpenses.value,
              fSubMinorExpenses: dado.fSubMinorExpenses.value,
              fLeruExpenses: dado.fLeruExpenses.value
              };
/*
-- Caso precise salvar no banco um valor diferente do que veio no form, pode usar a logica abaixo
  if (data.acordo === "on") {
      data.acordo = "Acordado";
  }
*/
  xhrPost(REST_DATA, data, function(item) {
    row.setAttribute('data-id', item.id);
    callback && callback();
    }, function(err) {
        console.error(err);
        });
} // Fim SaveChange

function valida() {
  //alert("Na funçao VALIDA");

  if (document.formNewReq.fHWOEM.value == "") {
    alert("The field for the question 'Will this BT be used for HW /SW OEM G2(No Services)' is blank");
    document.formNewReq.fHWOEM.focus();
    return false;
  } else if (document.formNewReq.fType[0].checked == false &&
             document.formNewReq.fType[1].checked == false) {
              // Request Type = "fType" (Radio) => New/Update
              alert("The Request Type field is mandatory !");
              document.formNewReq.fType[0].focus();
              return false;
  } else if (document.formNewReq.fUpdateListDisplay1.checked == false &&
             document.formNewReq.fUpdateListDisplay2.checked == false &&
             document.formNewReq.fUpdateListDisplay3.checked == false) {
              // Update Choices = "fUpdateListDisplay1" "fUpdateListDisplay2" e "fUpdateListDisplay3" (Check)=> Natop, Bond e Finance
              alert("The Update Choices field is mandatory !");
              document.formNewReq.fUpdateListDisplay1.focus();
              return false;
  } else if (document.getElementById("fLineofBusiness").selectedIndex == 0) {
              // Line of Business = "fLineofBusiness" (Select)
              alert("The Line of Business field is mandatory !");
              document.formNewReq.fLineofBusiness.focus();
              return false;
  } else if (document.getElementById("fUpdateBT").selectedIndex == 0) {
              // Business Type = "fUpdateBT" (Select)
              alert("The Business Type field is mandatory !");
              document.formNewReq.fUpdateBT.focus();
              return false;

  } else if (document.formNewReq.fNewBT.value == "") {
              // New Business Type = "fNewBT" (texto)
              alert("The New Business Type field is mandatory !");
              document.formNewReq.fNewBT.focus();
              return false;

  } else if (document.formNewReq.fBusinessTitle.value == "") {
              // Business Type Description = "fBusinessTitle" (texto)
              alert("The Business Type Description field is mandatory !");
              document.formNewReq.fBusinessTitle.focus();
              return false;

  } else if (document.formNewReq.ftBTJustification.value == "") {
            // Business Justification = "ftBTJustification"
            alert("The Business Justification field is mandatory !");
            document.formNewReq.ftBTJustification.focus();
            return false;

  } else if (document.formNewReq.fCompetencySegment.value == "select") {
          // Competency Segment = "fCompetencySegment" (Select)
          alert("The Competency Segment field is mandatory !");
          document.formNewReq.fCompetencySegment.focus();
          return false;

  } else if (document.formNewReq.fBTStatus.value == "select") {
          // Business Type Status = "fBTStatus" (Select)
          alert("The Business Type Status field is mandatory !");
          document.formNewReq.fBTStatus.focus();
          return false;

  } else if (document.formNewReq.fNATOP.value == "") {
            // Natop = "fNATOP" (text)
            alert("The Natop field is mandatory !");
            document.formNewReq.fNATOP.focus();
            return false;

  } else if (document.formNewReq.fNATOPCode.value == "") {
            // Natop = "fNATOPCode" (text)
            alert("The Natop code field is mandatory !");
            document.formNewReq.fNATOPCode.focus();
            return false;

  } else if (document.formNewReq.fDivCost.value == "select") {
        // IBM Labor Cost Account - Division = "fDivCost" (Select)
        alert("The Labor Cost Account - Division field is mandatory !");
        document.formNewReq.fDivCost.focus();
        return false;

  } else if (document.formNewReq.fMajCost.value == "") {
        // IBM Labor Cost Account - Major = "fMajCost" (text)
        alert("The Labor Cost Account - Major field is mandatory !");
        document.formNewReq.fMajCost.focus();
       return false;

   } else if (document.formNewReq.fMinorCost.value == "") {
      // IBM Labor Cost Account - Minor = "fMinorCost" (text)
       alert("The Labor Cost Account - Minor field is mandatory !");
       document.formNewReq.fMinorCost.focus();
       return false;

    } else if (document.formNewReq.fSubMinorCost.value == "") {
      // IBM Labor Cost Account - Subminor = "fSubMinorCost" (text)
        alert("The Labor Cost Account - Subminor field is mandatory !");
        document.formNewReq.fSubMinorCost.focus();
        return false;

    } else if (document.formNewReq.fDivContractorCost.value == "select") {
           // CONTRACTOR LABOR COST ACCOUNT - Division = "fDivContractorCost" (Select)
           alert("The CONTRACTOR LABOR COST ACCOUNT - Division field is mandatory !");
           document.formNewReq.fDivContractorCost.focus();
           return false;

    } else if (document.formNewReq.fMajContractorCost.value == "") {
           // CONTRACTOR LABOR COST ACCOUNT - Major = "fMajContractorCost" (text)
           alert("The CONTRACTOR LABOR COST ACCOUNT - Major field is mandatory !");
           document.formNewReq.fMajContractorCost.focus();
           return false;

    } else if (document.formNewReq.fMinorContractorCost.value == "") {
           // CONTRACTOR LABOR COST ACCOUNT - Minor = "fMinorContractorCost" (text)
           alert("The CONTRACTOR LABOR COST ACCOUNT - Minor field is mandatory !");
           document.formNewReq.fMinorContractorCost.focus();
           return false;

     } else if (document.formNewReq.fSubContractorMinorCost.value == "") {
          // CONTRACTOR LABOR COST ACCOUNT - Subminor = "fSubContractorMinorCost" (text)
          alert("The CONTRACTOR LABOR COST ACCOUNT - Subminor field is mandatory !");
          document.formNewReq.fSubContractorMinorCost.focus();
          return false;

//TEST HERE

    } else if (document.formNewReq.fDivRevenue.value == "select") {
          // REVENUE ACCOUNT - Division = "fDivRevenue" (Select)
           alert("The REVENUE ACCOUNT - Division field is mandatory !");
           document.formNewReq.fDivRevenue.focus();
           return false;

    } else if (document.formNewReq.fMajRevenue.value == "") {
           // REVENUE ACCOUNT - Major = "fMajRevenue" (text)
           alert("The REVENUE ACCOUNT - Major field is mandatory !");
           document.formNewReq.fMajRevenue.focus();
           return false;

    } else if (document.formNewReq.fMinorRevenue.value == "") {
           // REVENUE ACCOUNT - Minor = "fMinorRevenue" (text)
           alert("The REVENUE ACCOUNT - Minor field is mandatory !");
           document.formNewReq.fMinorRevenue.focus();
           return false;

     } else if (document.formNewReq.fSubMinorRevenue.value == "") {
          // REVENUE ACCOUNT - Subminor = "fSubMinorRevenue" (text)
          alert("The REVENUE ACCOUNT - Subminor field is mandatory !");
          document.formNewReq.fSubMinorRevenue.focus();
          return false;

      } else if (document.formNewReq.fDivEarlyRevenue.value == "select") {
          // EARLY REVENUE ACCOUNT - Division = "fDivEarlyRevenue" (Select)
         alert("The EARLY REVENUE ACCOUNT - Division field is mandatory !");
         document.formNewReq.fDivEarlyRevenue.focus();
         return false;

      } else if (document.formNewReq.fMajEarlyRevenue.value == "") {
           // EARLY REVENUE ACCOUNT - Major = "fMajEarlyRevenue" (text)
           alert("The EARLY REVENUE ACCOUNT - Major field is mandatory !");
           document.formNewReq.fMajEarlyRevenue.focus();
           return false;

      } else if (document.formNewReq.fMinoEarlyrRevenue.value == "") {
           // EARLY REVENUE ACCOUNT - Minor = "fMinoEarlyrRevenue" (text)
           alert("The EARLY ACCOUNT - Minor field is mandatory !");
           document.formNewReq.fMinoEarlyrRevenue.focus();
           return false;

      } else if (document.formNewReq.fSubEarlyMinorRevenue.value == "") {
          // EARLY REVENUE ACCOUNT - Subminor = "fSubEarlyMinorRevenue" (text)
          alert("The EARLY ACCOUNT - Subminor field is mandatory !");
          document.formNewReq.fSubEarlyMinorRevenue.focus();
          return false;

    } else if (document.formNewReq.fDivTax.value == "select") {
        // TAX ACCOUNT - Division = "fDivTax" (Select)
       alert("The TAX ACCOUNT - Division field is mandatory !");
       document.formNewReq.fDivTax.focus();
       return false;

    } else if (document.formNewReq.fMajTax.value == "") {
         // TAX ACCOUNT - Major = "fMajTax" (text)
         alert("The TAX ACCOUNT - Major field is mandatory !");
         document.formNewReq.fMajTax.focus();
         return false;

    } else if (document.formNewReq.fMinorTax.value == "") {
         // TAX ACCOUNT - Minor = "fMinorTax" (text)
         alert("The TAX - Minor field is mandatory !");
         document.formNewReq.fMinorTax.focus();
         return false;

    } else if (document.formNewReq.fSubMinorTax.value == "") {
        // TAX ACCOUNT - Subminor = "fSubMinorTax" (text)
        alert("The TAX ACCOUNT - Subminor field is mandatory !");
        document.formNewReq.fSubMinorTax.focus();
        return false;

    } else if (document.formNewReq.fDivEarlyTax.value == "select") {
        // EARLY TAX ACCOUNT - Division = "fDivEarlyTax" (Select)
       alert("The EARLY TAX ACCOUNT - Division field is mandatory !");
       document.formNewReq.fDivEarlyTax.focus();
       return false;

    } else if (document.formNewReq.fMajEarlyTax.value == "") {
         // EARLY TAX ACCOUNT - Major = "fMajEarlyTax" (text)
         alert("The EARLY TAX ACCOUNT - Major field is mandatory !");
         document.formNewReq.fMajEarlyTax.focus();
         return false;

    } else if (document.formNewReq.fMinorEarlyTax.value == "") {
         // EARLY TAX ACCOUNT - Minor = "fMinorEarlyTax" (text)
         alert("The EARLY TAX ACCOUNT - Minor field is mandatory !");
         document.formNewReq.fMinorEarlyTax.focus();
         return false;

    } else if (document.formNewReq.fSubMinorEarlyTax.value == "") {
        // EARLY TAX ACCOUNT - Subminor = "fSubMinorEarlyTax" (text)
        alert("The EARLY TAX ACCOUNT - Subminor field is mandatory !");
        document.formNewReq.fSubMinorEarlyTax.focus();
        return false;



    } else if (document.formNewReq.fDivExpenses.value == "select") {
        // EXPENSES DES - IMS ACCOUNT - Division = "fDivExpenses" (Select)
       alert("The EXPENSES DES - IMS ACCOUNT - Division field is mandatory !");
       document.formNewReq.fDivExpenses.focus();
       return false;

    } else if (document.formNewReq.fMajExpenses.value == "") {
         // EXPENSES DES - IMS ACCOUNT - Major = "fMajExpenses" (text)
         alert("The EXPENSES DES - IMS ACCOUNT - Major field is mandatory !");
         document.formNewReq.fMajExpenses.focus();
         return false;

    } else if (document.formNewReq.fMinorExpenses.value == "") {
         // EXPENSES DES - IMS ACCOUNT - Minor = "fMinorExpenses" (text)
         alert("The EXPENSES DES - IMS ACCOUNT - Minor field is mandatory !");
         document.formNewReq.fMinorExpenses.focus();
         return false;

    } else if (document.formNewReq.fSubMinorExpenses.value == "") {
        // EXPENSES DES - IMS ACCOUNT - Subminor = "fSubMinorExpenses" (text)
        alert("The EXPENSES DES - IMS ACCOUNT - Subminor field is mandatory !");
        document.formNewReq.fSubMinorExpenses.focus();
        return false;

  }    else {
        return true;
      }
} // fim do function valida
