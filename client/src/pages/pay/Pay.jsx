import React from 'react'
import "./Pay.scss"
import {loadStripe} from "@stripe/stripe-js"
import { Elements } from '@stripe/react-stripe-js'
import { useState } from 'react';
import { useEffect } from 'react';
import newRequest from '../../utils/newRequest';
import { useParams } from 'react-router-dom';
import Checkoutform from '../../components/checkOutFrom/Checkoutform';

const stripePromise = loadStripe("pk_test_51SMwiF41rozkLmOAEvu4YZHVg3Sxhz5OVaNX0edZ4XpM68D27Sy5ijazswQHpsWcV2Kx6OWBnyDm3Mn4ANS6womn00kIRUIyRl");

const Pay = () => {

    const [clientSecret, setClientSecret] = useState("")

    const {id} = useParams()

    useEffect(()=>{
        const makeRequest = async ()=>{
            try {
                const res = await newRequest.post(`/orders/create-payment-intent/${id}`)
                setClientSecret(res.data.clientSecret)
            } catch (error) {
                console.log(error);
                
            }
        };
        makeRequest()
    },[])

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance
    }
    return (
      <div className='pay'>{clientSecret && (
        <Elements options={options} stripe={stripePromise}>
            <Checkoutform/>
        </Elements>
      )}

      </div>
    )
}

export default Pay;