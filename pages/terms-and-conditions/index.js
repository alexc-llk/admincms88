

const TermsAndConditions = () => {
  return (
    <div className="flex flex-col mx-auto min-h-[80vh] m-10 py-5 px-10 w-3/4 text-justify text-sm bg-blue-200 rounded-md">
      <h1 className="text-lg font-[500] my-2">Terms and Conditions</h1>
      <h3 className="text-base mb-3">{`Welcome to Admin88 CMS! These terms and conditions ("Terms") govern your use of our web application and any related services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use our Service.`}</h3>

      <h3 className="font-[500]">{`1. Acceptance of Terms`}</h3>
      <p className="my-2">
        {`1.1 By using the Service, you affirm that you are of legal age to enter into these Terms and have read, understood, and agree to be bound by them.`} <br />
        {`1.2 If you are accepting these Terms on behalf of a company or other legal entity, you represent and warrant that you have the authority to bind that entity to these Terms, and references to "you" and "your" in these Terms will refer to both the individual user and the entity they represent.`}
      </p>

      <h3 className="font-[500]">{`2. Data Analytics for Business Decision Making`}</h3>
      <p className="my-2">
        {`2.1 Our Service provides generic data analytics capabilities to assist in business decision making.`} <br />
        {`2.2 You acknowledge and agree that the accuracy, completeness, and availability of the aggregated data are subject to the platforms' terms of service and policies, and we do not guarantee the accuracy or reliability of such data.`} <br />
        {`2.3 You are solely responsible for the data you choose to aggregate through our Service, including ensuring compliance with the terms and policies of the respective platforms.`} <br />
        {`2.4 We do not guarantee specific outcomes or results from the data analytics performed by our Service.`}
      </p>

      <h3 className="font-[500]">{`3. Intellectual Property`}</h3>
      <p className="my-2">
        {`3.1 Our Service and its original content (excluding the aggregated data) are and will remain the exclusive property of Admin88 CMS and its licensors.`} <br />
        {`3.2 You agree not to reproduce, modify, distribute, display, or create derivative works from any part of our Service without prior written consent from us.`} 
      </p>

      <h3 className="font-[500]">{`4. Privacy`}</h3>
      <p className="my-2">
        {`4.1 Our Privacy Policy explains how we collect, use, and disclose information from users of our Service. By using the Service, you consent to our collection, use, and disclosure practices as described in the Privacy Policy.`} <br />
      </p>

      <h3 className="font-[500]">{`5. Disclaimer of Warranties`}</h3>
      <p className="my-2">
        {`5.1 The Service is provided on an "as is" and "as available" basis, without warranties of any kind, whether express or implied.`} <br />
        {`5.2 We do not warrant that the Service will be uninterrupted, error-free, secure, or free from viruses or other harmful components.`} <br />
        {`5.3 You use the Service at your own risk, and we disclaim all warranties, including any implied warranties of merchantability, fitness for a particular purpose, and non-infringement.`}
      </p>

      <h3 className="font-[500]">{`6. Limitation of Liability`}</h3>
      <p className="my-2">
        {`6.1 To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, consequential, special, punitive, or exemplary damages, or any loss of profits or revenue, arising out of or in connection with your use of the Service.`} <br />
        {`6.2 Our total liability, whether in contract, tort, or otherwise, arising out of or in connection with the Service, shall not exceed the fees paid by you, if any, for using the Service during the twelve (12) months prior to the event giving rise to the liability.`} 
      </p>
      
      <h3 className="font-[500]">{`7. Indemnification`}</h3>
      <p>{`7.1 You agree to indemnify and hold harmless Admin88 CMS and its affiliates, officers, directors, employees, and agents from and against any and`}</p>
    </div>
  )
}

export default TermsAndConditions