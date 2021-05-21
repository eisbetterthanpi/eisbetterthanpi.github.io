
def date(dmy):
    s=dmy.split("/")
    day,month,year=int(s[0]),int(s[1]),int(s[2])-1900
    key=[1,4,4,0,2,5,0,3,6,1,4,6]
    date=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
    return date[((day+key[month-1]+year+year//4)%7)-1]
