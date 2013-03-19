function checkNumber(input, min, max, msg)
{
    msg = msg + " field has invalid data: " + input.value;

    var str = input.value;
    for (var i = 0; i < str.length; i++) {
        var ch = str.substring(i, i + 1)
        if ( ( ch < "0" || "9" < ch ) && ch != '.') {
            alert( msg );
            return false;
        }
    }

    var num = parseFloat(str)
    if (num < min || max <= num) {
        alert(msg + " not in range [" + min + ".." + max + "]");
        return false;
    }

    input.value = str;
    return true;
}

function computeField(input)
{
  if (input.value != null && input.value.length != 0)
	input.value = "" + eval(input.value);
  computeForm(input.form);
}

function computeInverseField(input)
{
  if (input.value != null && input.value.length != 0)	{
		input.value = "" + eval(input.value);
	  computeInverseForm(input.form);
	}
}

function MakeArray(size)
{
	this.length = size;
  for(var i = 1; i <= size; i++)
	{
		this[i] = 0;
	}
	return this;
}

function monthLength(month, leap)
{
	monthLengthArray = new MakeArray(12);

	monthLengthArray[1] = 32;
	monthLengthArray[2] = 29 + leap;
	monthLengthArray[3] = 32;
	monthLengthArray[4] = 31;
	monthLengthArray[5] = 32;
	monthLengthArray[6] = 31;
	monthLengthArray[7] = 32;
	monthLengthArray[8] = 32;
	monthLengthArray[9] = 31;
	monthLengthArray[10] = 32;
	monthLengthArray[11] = 31;
	monthLengthArray[12] = 32;

	return monthLengthArray[month];
}

function computeTheForm(form)
{
	var leap = (
		(document.forms[0].calendar[0].checked == 0) && (form.year.value%4 == 0)? 1:
		(form.year.value%4 != 0? 0: 
		(form.year.value%400 == 0? 1:
		(form.year.value%100==0? 0:1 ) ) ) );

    if (!checkNumber(form.month, 1, 13, "Month") ||
        !checkNumber(form.day, 1, monthLength(parseFloat(form.month.value), leap), "Day") ||
        !checkNumber(form.year, 1,1000000, "Year")) {
        form.julianDay.value = "Invalid";
        return;
    }
	var D = eval(form.day.value);
	var M = eval(form.month.value);
	var Y = eval(form.year.value);
	if(M<3)	{
		Y--;
		M += 12;
	}

//alert("D= " + D);
//alert("M= " + M);
//alert("Y= " + Y);
	if(document.forms[0].calendar[0].checked == true)	{
		var A = Math.floor(Y/100);
		var B = Math.floor(A/4);
		var C = 2 - A + B;
	}
	else
		C=0;
	//alert("C= " + C);
	var E = Math.floor(365.25*(Y + 4716));
	//alert("E= " + E);
	var F = Math.floor(30.6001*(M + 1));
	//alert("F= " + F);
	var julianday = C + eval(D) + E + F - 1524.5;
//	if(julianday<2299160.5)	{
//		alert("The date you have entered is before the introduction of the Gregorian calendar!");
//		NewJD = "Invalid";
//	}
//	else
 	 NewJD = julianday;

//	if(julianday - Math.floor(julianday) != 0.5)
//	 NewJD = "Invalid";

	if(form.julianDay.value == null || form.julianDay.value.length == 0)
		form.julianDay.value = NewJD;
	else
		if(form.julianDay.value != NewJD) form.julianDay.value = NewJD;
}

function computeInverseForm(form)
{
	if(!checkNumber(form.julianDay,2299160.5,100000000000,"Julian Day Number"))	{
		alert("Date entered before October 15, 1582. Result is on Gregorian Proleptic Calendar.");
//		form.julianDay.value = "Invalid";
//		return;
	}
	var JD = eval(form.julianDay.value);

	Z = JD+0.5;
	F = Z - Math.floor(Z);

	if(document.forms[0].calendar[0].checked == true)	{
		Z = Math.floor(Z);
		W = Math.floor((Z - 1867216.25)/36524.25);
		X = Math.floor(W/4);
		A = Z + 1 + W - X;
	}
	else
		A = Z;
	B = A + 1524;
	C = Math.floor((B - 122.1)/365.25);
	D = Math.floor(365.25*C);
	E = Math.floor((B - D)/30.6001);

	NewMonth = E>13? E-13: E-1;
	NewDay = B - D - Math.floor(30.6001*E) +F;
	NewYear = NewMonth<3? C-4715: C-4716;

  if ((form.month.value == null || form.month.value.length == 0) ||
        (form.day.value == null || form.day.value.length == 0) ||
        (form.year.value == null || form.year.value.length == 0)) {
		form.month.value = NewMonth;
		form.day.value = NewDay;
		form.year.value = NewYear;
	}
	else {
		if(form.month.value != NewMonth) form.month.value = NewMonth;
		if(form.day.value != NewDay) form.day.value = NewDay;
		if(form.year.value != NewYear) form.year.value = NewYear;
	}
}

function computeForm(form)
{
    if ((form.month.value == null || form.month.value.length == 0) ||
        (form.day.value == null || form.day.value.length == 0) ||
        (form.year.value == null || form.year.value.length == 0)) 
             {
             if(form.julianDay.value == null || form.julianDay.value.length == 0)
                  return;
             else
                  computeInverseForm(form);
    }
	computeTheForm(form);
}

function clearForm(form)
{
    form.month.value = "";
    form.day.value = "";
    form.year.value = "";
    form.julianDay.value = "";
//	alert(document.forms[0].calendar[0].checked);
//	alert(document.forms[0].calendar[1].checked);
}