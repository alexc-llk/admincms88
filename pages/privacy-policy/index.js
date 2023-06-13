import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col mx-auto min-h-[80vh] m-10 py-5 px-10 w-3/4 text-justify text-sm bg-blue-200 rounded-md">
        <h1 className="text-lg font-[500] my-2">Privacy Policy</h1>
        <h3 className='text-base mb-3'>{`This Privacy Policy governs the manner in which Admin88 CMS collects, uses, maintains, and discloses information collected from users (each, a "User") of the Admin88 CMS web application and related services (the "Service"). This policy applies to the Service provided by Admin88 CMS.`}</h3>

        <h3 className="font-[500]">{`1. Information Collection`}</h3>
        <p className="my-2">
          {`1.1 Personal Identification Information: We may collect personal identification information from Users in various ways, including when Users visit our Service, register on the Service, or fill out a form. The personal identification information collected may include name, email address, and other relevant information necessary for the provision of the Service.`} <br />
          {`1.2 Non-personal Identification Information: We may collect non-personal identification information about Users whenever they interact with our Service. Non-personal identification information may include the browser name, the type of computer or device used, technical information about Users' means of connection to our Service, and other similar information.`}
        </p>

        <h3 className="font-[500]">{`2. Information Use`}</h3>
        <p className="my-2">
          {`2.1 Admin88 CMS may collect and use Users' personal identification information for the following purposes:`} <br />
          <ul className='ml-10 my-2 list-disc'>
            <li>To provide and improve customer service: Information you provide helps us respond to your customer service requests and support needs more efficiently.</li>
            <li>To personalize user experience: We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Service.</li>
            <li>To improve our Service: We continually strive to improve our Service based on the information and feedback we receive from Users.</li>
            <li>To send periodic emails: We may use the email address to respond to inquiries, questions, and/or other requests from Users.</li>
          </ul>
          {`2.2 We may use non-personal identification information for the purposes outlined above and for other purposes consistent with our Service's nature and objectives.`}
        </p>

        <h3 className="font-[500]">{`3. Information Protection`}</h3>
        <p className="my-2">
          {`3.1 We adopt appropriate data collection, storage, and processing practices, as well as security measures, to protect against unauthorized access, alteration, disclosure, or destruction of Users' personal information, username, password, transaction information, and data stored on our Service.`} <br />
        </p>

        <h3 className="font-[500]">{`4. Data Sharing`}</h3>
        <p className="my-2">
          {`4.1 We do not sell, trade, or rent Users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.`} <br />
        </p>

        <h3 className="font-[500]">{`5. Third-Party Websites`}</h3>
        <p className="my-2">
          {`5.1 Users may find advertising or other content on our Service that links to the sites and services of our partners, suppliers, advertisers, sponsors, licensors, and other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Service.`} <br />
          {`5.2 Browsing and interaction on any other website, including websites that have a link to our Service, are subject to that website's own terms and policies. We strongly advise Users to review the privacy policies of any third-party websites they visit.`} <br />
        </p>

        <h3 className="font-[500]">{`6. Changes to this Privacy Policy`}</h3>
        <p className="my-2">
          {`6.1 Admin88 CMS has the discretion to update this Privacy Policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.`} <br />
        </p>        

        <h3 className="font-[500]">{`7. Acceptance of these Terms`}</h3>
        <p className="my-2">
          {`7.1 By using our Service, you signify your acceptance of this Privacy Policy. If you do not agree to this policy, please do not use our Service. Your continued use of the Service following the posting of changes to this policy will be deemed as your acceptance of those changes.`} <br />
        </p>   

        <h3 className="font-[500]">{`8. Contacting Us`}</h3>
        <p className="my-2">
          {`8.1 If you have any questions or concerns regarding this Privacy Policy or the practices of our Service, please feel free to contact us. We will make every effort to address your inquiries and concerns in a timely manner. Please make sure to include your preferred contact information or a statement directing users on how to contact your company for privacy-related inquiries and concerns.`} <br />
        </p>   
    </div>
  )
}

export default PrivacyPolicy