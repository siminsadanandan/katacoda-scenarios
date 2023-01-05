# Snowflake data seeding using python UDF

__References:__
<https://medium.com/snowflake/flaker-2-0-fake-snowflake-data-the-easy-way-dc5e65225a13>
<https://www.snowflake.com/blog/synthetic-data-generation-at-scale-part-1/>

Faker UDF is based on python faker library - <https://faker.readthedocs.io/en/master/index.html>


— Step#1 You need to be ORGADMIN to enable Anaconda faker python package

![diagram1](https://github.com/siminsadanandan/katacoda-scenarios/blob/696f3c75ebec013bd1a64b730626ceae2f54c862/sf-config-image.jpg)
![diagram2](/sf-config-image.jpg)

— Step#2 Once the above step is complete you can create the UDF FAKE function which uses python faker library. 

`create or replace function FAKE(locale varchar,provider varchar,parameters variant)
returns variant
language python
volatile
runtime_version = '3.8'
packages = ('faker','simplejson')
handler = 'fake'
as
$$
import simplejson as json
from faker import Faker
def fake(locale,provider,parameters):
  if type(parameters).__name__=='sqlNullWrapper':
    parameters = {}
  fake = Faker(locale=locale)
  return json.loads(json.dumps(fake.format(formatter=provider,**parameters), default=str))
$$;`



— Step#3 you can use the fake UDF function (FAKE) to generate data, in addition we are also using snowflake data seeding functions like  seq8, 
uniform etc. 

`select (seq8()+1)::bigint as ID, FAKE ('en_US','prefix',null)::varchar as SUFFIX, FAKE ('en_US','first_name',null)::varchar as FNAME, FAKE ('en_US','last_name',null)::varchar as LNAME, FAKE ('en_US','email',null)::varchar as EMAIL, FAKE ('en_US','phone_number',null)::varchar as PHONE_NUMBER, FAKE ('en_US','date_between',{'start_date':'-180d','end_date':'today'})::date as HIREDATE, FAKE ('en_US','job',null)::varchar as JOB_TITLE, uniform(1000000,3000000,random(1)):: NUMBER(10) as SALARY, uniform(10000,20000,random(1)):: NUMBER(5) as COMSN_PCT, uniform(100,300,random(1)):: NUMBER(5) as MANAGER_ID, uniform(10,30,random(1)):: NUMBER(5) as DEPARTMENTID, FAKE ('en_US','bs',null)::varchar as DEPARMENTNAME, FAKE ('en_US','date_of_birth',null) :: VARCHAR as DOB, FAKE ('en_US','street_address',null) :: VARCHAR as STREET_ADDRESS, FAKE ('en_US','city',null) :: VARCHAR as CITY, FAKE ('en_US','state',null) :: VARCHAR as STATE, FAKE ('en_US','country',null) :: VARCHAR as COUNTRY, FAKE ('en_US','postcode',null) :: VARCHAR as POSTALCODE, FAKE ('en_US','company',null) :: VARCHAR as ORGANIZATION_NAME, FAKE ('en_US','credit_card_number',null) :: VARCHAR as CREDIT_CARD_NO, FAKE ('en_US','ssn',null) :: VARCHAR as SSN, FAKE ('en_US','past_date',{'start_date': '-30d', 'tzinfo': 'UTC'})::TIMESTAMP_NTZ as DATETIME, FAKE ('en_US','name_female',null) :: VARCHAR as MAIDEN_NAME_MOTHER, FAKE ('en_US','name_male',null) :: VARCHAR as FATHERNAME, FAKE ('en_US','boolean',{'chance_of_getting_true':25})::varchar as ISMARRIED, FAKE ('en_US','year',null) :: NUMBER as YEAR, FAKE ('en_US','msisdn',null) :: VARCHAR as MSISDN, FAKE ('en_US','coordinate',null) :: FLOAT as FLOATDATA, FAKE ('en_US','company_suffix',null) :: VARCHAR as COMPANY_SUFFIX, FAKE ('en_US','bban',null) :: VARCHAR as BBAN, FAKE ('en_US','country_code',null) :: VARCHAR as BANK_COUNTRY, FAKE ('en_US','license_plate',null) :: VARCHAR as LICENSE_PLATE, FAKE ('en_US','localized_ean',null) :: NUMBER as EAN, FAKE ('en_US','color',null) :: VARCHAR as COLOR, FAKE ('en_US','linux_processor',null) :: VARCHAR as LINUX_PROCESSOR, FAKE ('en_US','coordinate',null) :: FLOAT as COORDINATE_DOUBLE, FAKE ('en_US','file_name',null) :: VARCHAR as FILE_NAME, FAKE ('en_US','file_extension',null) :: VARCHAR as FILE_EXTENSION, FAKE ('en_US','country_calling_code',null) :: VARCHAR as COUNTRY_CALLING_CODE, FAKE ('en_US','country_code',null) :: VARCHAR as COUNTRY_CODE, FAKE ('en_US','street_suffix',null) :: VARCHAR as STREET_SUFFIX, FAKE ('en_US','company_email',null) :: VARCHAR as COMPANY_EMAIL, FAKE ('en_US','domain_name',null) :: VARCHAR as DOMAIN_NAME, FAKE ('en_US','domain_word',null) :: VARCHAR as DOMAIN_WORD, FAKE ('en_US','timezone',null) :: VARCHAR as TIMEZONE, FAKE ('en_US','time',null) :: VARCHAR as TIMEASSTRING, FAKE ('en_US','month_name',null) :: VARCHAR as MONTH_NAME, FAKE ('en_US','iso8601',null) :: TIMESTAMP_NTZ as ISO8601_DTIME, FAKE ('en_US','currency_code',null) :: VARCHAR as CURRENCY_CODE, FAKE ('en_US','cryptocurrency_name',null) :: VARCHAR as CRYPTOCURRENCY_NAME, FAKE ('en_US','currency_symbol',null) :: VARCHAR as CURRENCY_SYMBOL
from
table(generator(rowcount => 1000));`
 

_*It took close to 4 min to seed the above 1000 records with Xsmall warehouse_



— Table with duplicate columns and inserting into target table

`insert into PERF_DATA_100COL_1MN_10 select * from (
select (seq8()+1)::bigint as ID, FAKE ('en_US','prefix',null)::varchar as SUFFIX, FAKE ('en_US','first_name',null)::varchar as FNAME, FAKE ('en_US','last_name',null)::varchar as LNAME, FAKE ('en_US','email',null)::varchar as EMAIL, FAKE ('en_US','phone_number',null)::varchar as PHONE_NUMBER, FAKE ('en_US','date_between',{'start_date':'-180d','end_date':'today'})::date as HIREDATE, FAKE ('en_US','job',null)::varchar as JOB_TITLE, uniform(1000000,3000000,random(1)):: NUMBER(10) as SALARY, uniform(10000,20000,random(1)):: NUMBER(5) as COMSN_PCT, uniform(100,300,random(1)):: NUMBER(5) as MANAGER_ID, uniform(10,30,random(1)):: NUMBER(5) as DEPARTMENTID, FAKE ('en_US','bs',null)::varchar as DEPARMENTNAME, FAKE ('en_US','date_of_birth',null) :: VARCHAR as DOB, FAKE ('en_US','street_address',null) :: VARCHAR as STREET_ADDRESS, FAKE ('en_US','city',null) :: VARCHAR as CITY, FAKE ('en_US','state',null) :: VARCHAR as STATE, FAKE ('en_US','country',null) :: VARCHAR as COUNTRY, FAKE ('en_US','postcode',null) :: VARCHAR as POSTALCODE, FAKE ('en_US','company',null) :: VARCHAR as ORGANIZATION_NAME, FAKE ('en_US','credit_card_number',null) :: VARCHAR as CREDIT_CARD_NO, FAKE ('en_US','ssn',null) :: VARCHAR as SSN, FAKE ('en_US','past_date',{'start_date': '-30d', 'tzinfo': 'UTC'})::TIMESTAMP_NTZ as DATETIME, FAKE ('en_US','name_female',null) :: VARCHAR as MAIDEN_NAME_MOTHER, FAKE ('en_US','name_male',null) :: VARCHAR as FATHERNAME, FAKE ('en_US','boolean',{'chance_of_getting_true':25})::varchar as ISMARRIED, FAKE ('en_US','year',null) :: NUMBER as YEAR, FAKE ('en_US','msisdn',null) :: VARCHAR as MSISDN, FAKE ('en_US','coordinate',null) :: FLOAT as FLOATDATA, FAKE ('en_US','company_suffix',null) :: VARCHAR as COMPANY_SUFFIX, FAKE ('en_US','bban',null) :: VARCHAR as BBAN, FAKE ('en_US','country_code',null) :: VARCHAR as BANK_COUNTRY, FAKE ('en_US','license_plate',null) :: VARCHAR as LICENSE_PLATE, FAKE ('en_US','localized_ean',null) :: NUMBER as EAN, FAKE ('en_US','color',null) :: VARCHAR as COLOR, FAKE ('en_US','linux_processor',null) :: VARCHAR as LINUX_PROCESSOR, FAKE ('en_US','coordinate',null) :: FLOAT as COORDINATE_DOUBLE, FAKE ('en_US','file_name',null) :: VARCHAR as FILE_NAME, FAKE ('en_US','file_extension',null) :: VARCHAR as FILE_EXTENSION, FAKE ('en_US','country_calling_code',null) :: VARCHAR as COUNTRY_CALLING_CODE, FAKE ('en_US','country_code',null) :: VARCHAR as COUNTRY_CODE, FAKE ('en_US','street_suffix',null) :: VARCHAR as STREET_SUFFIX, FAKE ('en_US','company_email',null) :: VARCHAR as COMPANY_EMAIL, FAKE ('en_US','domain_name',null) :: VARCHAR as DOMAIN_NAME, FAKE ('en_US','domain_word',null) :: VARCHAR as DOMAIN_WORD, FAKE ('en_US','timezone',null) :: VARCHAR as TIMEZONE, FAKE ('en_US','time',null) :: VARCHAR as TIMEASSTRING, FAKE ('en_US','month_name',null) :: VARCHAR as MONTH_NAME, FAKE ('en_US','iso8601',null) :: TIMESTAMP_NTZ as ISO8601_DTIME, FAKE ('en_US','currency_code',null) :: VARCHAR as CURRENCY_CODE, FAKE ('en_US','cryptocurrency_name',null) :: VARCHAR as CRYPTOCURRENCY_NAME, FAKE ('en_US','currency_symbol',null) :: VARCHAR as CURRENCY_SYMBOL, EMAIL, PHONE_NUMBER, HIREDATE, JOB_TITLE, SALARY, COMSN_PCT, MANAGER_ID, DEPARTMENTID, DEPARMENTNAME, DOB, STREET_ADDRESS, CITY, STATE, COUNTRY, POSTALCODE, ORGANIZATION_NAME, CREDIT_CARD_NO, SSN, DATETIME, MAIDEN_NAME_MOTHER, FATHERNAME, ISMARRIED, YEAR, MSISDN, FLOATDATA, COMPANY_SUFFIX, BBAN, BANK_COUNTRY, LICENSE_PLATE, EAN, COLOR, LINUX_PROCESSOR, COORDINATE_DOUBLE, FILE_NAME, FILE_EXTENSION, COUNTRY_CALLING_CODE, COUNTRY_CODE, STREET_SUFFIX, COMPANY_EMAIL, DOMAIN_NAME, DOMAIN_WORD, TIMEZONE, TIMEASSTRING, MONTH_NAME, ISO8601_DTIME, CURRENCY_CODE, CRYPTOCURRENCY_NAME, FAKE ('en_US','bban',null) :: VARCHAR as VIN
from
table(generator(rowcount => 5)));`

