import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { ClientFormPersonalData } from "../../components/ClientForm/ClientFormPersonalData";
import { useContext, useEffect, useState } from "react";
import { ClientFormAddress } from "../../components/ClientForm/ClientFormAddress";
import { ClientFormEconomics } from "../../components/ClientForm/ClientFormEconomics";
import { ClientFormBusinessData } from "../../components/ClientForm/ClientFormBusinessData";
import { ClientFormSummary } from "../../components/ClientForm/ClientFormSummary";
import { AppContext } from "../../store/store";
import { Geolocation } from "@capacitor/geolocation";
import { ClientFormSPLD } from "../../components/ClientForm/ClientFormSPLD";
// import { ClientFormIdentity } from "../../components/ClientForm/ClientFormIdentity";
// import { ClientFormComprobanteDomicilio } from "../../components/ClientForm/ClientFormComprobanteDomicilio";


interface ClientFormProps {
  onSubmit: any;
}

export const ClientForm: React.FC<ClientFormProps> = ({ onSubmit }) => {
  
  
  const { clientData,dispatchClientData } = useContext(AppContext);  

  const [lat,setLat] = useState(0);
  const [lng, setLng] = useState(0);

  useEffect( ()=>{
    async function loadCoordinates (){
      const coordsData = await Geolocation.getCurrentPosition();
      setLat(coordsData.coords.latitude);
      setLng(coordsData.coords.longitude);
    }
    loadCoordinates();
  },[])
   

  function onPersonalDataNext(data:any){
    
    dispatchClientData({
      type: 'SET_CLIENT',
      ...clientData,
      ...data
    })
  };



  function updateAddressBasedOnType ( typeAdd: string, newAddressData:any){
    /// 1. determines whether a HOME address exists

    let newAddressList = clientData.address
    
    const homeAddress = newAddressList.find( (i:any) => i.type=== typeAdd );
    ///2. if exists, update it
    if( homeAddress)
      newAddressList = clientData.address.map( (add:any) => (
          add._id === homeAddress._id ? {...add,...newAddressData} : { ...add } ))
     else // 3. If not, add it
      newAddressList.push({
        _id: Date.now().toString(),
        ...newAddressData
      })
    
    return newAddressList

  }

  function onHomeAddressNext( data:any){
    
    dispatchClientData({ 
      type:"SET_CLIENT",
      ...clientData,
      coordinates: [lat,lng],
      address:  updateAddressBasedOnType('DOMICILIO',data)
    })
    
  }
  function onEconomicsData(data:any){
    
    dispatchClientData({
      type: "SET_CLIENT",
      ...clientData,
      marital_status: data.marital_status,
      education_level: data.education_level,
      rol_hogar: data.rol_hogar,
      household_floor: data.household_floor,
      household_roof: data.household_roof,
      household_toilet: data.household_toilet,
      household_latrine: data.household_latrine,
      household_brick: data.housegold_brick,
      economic_dependants: data.economic_dependants,
      internet_access: data.internet_access,
      prefered_social: data.prefered_social,
      user_social: data.user_social,
      has_disable: data.has_disable,
      speaks_dialect: data.speaks_dialect,
      has_improved_income: data.has_improved_income,
    })

  }

  function onBisDataNext( data:any){
    
    dispatchClientData({
      type: "SET_CLIENT",
      ...clientData,
      rfc: data.rfc,
      business_data: {
        ...clientData.business_data,
        bis_location: data.bis_location,
        profession: data.profession,
        ocupation: data.ocupation,
        economic_activity: data.economic_activity,
        business_start_date: data.business_start_date,
        business_name: data.business_name,
        business_owned: data.business_owned,
        business_phone: data.business_phone,
        number_employees: data.number_employees,
        loan_destination: data.loan_destination,
        income_sales_total: data.income_sales_total,
        income_partner: data.income_partner,
        income_job: data.income_job,
        income_remittances: data.income_remittances,
        income_other: data.income_other,
        income_total: data.income_total,
        expense_family: data.expense_family,
        expense_rent: data.expense_rent,
        expense_business: data.expense_business,
        expense_debt: data.expense_debt,
        expense_credit_cards: data.expense_credit_cards,
        expense_total: data.expense_total,
        keeps_accounting_records: data.keeps_accounting_records,
        has_previous_experience: data.has_previous_experience,
        previous_loan_experience: data.previous_loan_experience,
        bis_season_type: data.bis_season_type,
        bis_quality_sales_monthly: {
          month_sale_jan: data.bis_quality_sales_monthly.month_sale_jan,
          month_sale_feb: data.bis_quality_sales_monthly.month_sale_feb,
          month_sale_mar: data.bis_quality_sales_monthly.month_sale_mar,
          month_sale_apr: data.bis_quality_sales_monthly.month_sale_apr,
          month_sale_may: data.bis_quality_sales_monthly.month_sale_may,
          month_sale_jun: data.bis_quality_sales_monthly.month_sale_jun,
          month_sale_jul: data.bis_quality_sales_monthly.month_sale_jul,
          month_sale_aug: data.bis_quality_sales_monthly.month_sale_aug,
          month_sale_sep: data.bis_quality_sales_monthly.month_sale_sep,
          month_sale_oct: data.bis_quality_sales_monthly.month_sale_oct,
          month_sale_nov: data.bis_quality_sales_monthly.month_sale_nov,
          month_sale_dic: data.bis_quality_sales_monthly.month_sale_dic,
        }
  
      }
    })
  }

  function onBisAddressNext( data:any){
    console.log(data)
    dispatchClientData({ 
      type:"SET_CLIENT",
      ...clientData,
      address: updateAddressBasedOnType('NEGOCIO',data)
    })
  }
  function onSpldNext( data:any) {
    dispatchClientData( {
      type: "SET_CLIENT",
      ...clientData,
      spld: {...data.spld }     
    })
  }

  function sendData( data: any) {
    onSubmit({...clientData,...data,});
  }


  return (
    <Swiper spaceBetween={50} slidesPerView={1} allowTouchMove={false}>

      <SwiperSlide>
        <ClientFormPersonalData onNext={onPersonalDataNext} />
      </SwiperSlide>

       <SwiperSlide>
        <ClientFormAddress addressType={"DOMICILIO"} onNext={onHomeAddressNext} />
      </SwiperSlide>
     
      <SwiperSlide>
        <ClientFormEconomics onNext={onEconomicsData}  />
      </SwiperSlide>
 
      <SwiperSlide>
        <ClientFormBusinessData onNext={onBisDataNext} />
      </SwiperSlide>
      
      <SwiperSlide>
          <ClientFormAddress addressType={"NEGOCIO"} onNext={onBisAddressNext} />
      </SwiperSlide>
      <SwiperSlide>
        <ClientFormSPLD onNext={onSpldNext}/>
      </SwiperSlide>
       
      <SwiperSlide>
        <ClientFormSummary onNext={sendData}/>
      </SwiperSlide> 

    </Swiper>
  );
};
