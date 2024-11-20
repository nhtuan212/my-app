"use client";

import React, { useEffect, useState } from "react";
import { getVerificationReq } from "@/app/utils";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import JSONPretty from "react-json-pretty";

const APP_ID = "0x486dD3B9C8DF7c9b263C75713c79EC1cf8F592F2";
const APP_SECRET =
    "0x1f86678fe5ec8c093e8647d5eb72a65b5b2affb7ee12b70f74e519a77b295887";

export default function HomePage() {
    const [myProviders, setMyProviders] = useState([]);
    const [proofs, setProofs] = useState();
    const [selectedProviderId, setSelectedProviderId] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [url, setUrl] = useState("");

    const getVerificationReq = async (providerId) => {
        try {
            setIsLoaded(true);
            const reclaimClient = await ReclaimProofRequest.init(
                APP_ID,
                APP_SECRET,
                providerId,
                { log: false, acceptAiProviders: true }
            );
            const reclaimClientJson = reclaimClient.toJsonString();
            const sessionId = JSON.parse(reclaimClientJson).sessionId;
            reclaimClient.setRedirectUrl(
                `https://demo.reclaimprotocol.org/session/${sessionId}`
            );

            const requestUrl = await reclaimClient.getRequestUrl();
            const statusUrl = await reclaimClient.getStatusUrl();
            console.log("requestUrl", requestUrl);
            console.log("statusUrl", statusUrl);

            setUrl(requestUrl);
            // setShowQR(true);
            // setShowButton(false);
            // setIsLoaded(false);

            await reclaimClient.startSession({
                onSuccess: async (proof) => {
                    console.log("Verification success", proof);
                    // Your business logic here
                    setProofs(proof);
                    // setShowQR(false);
                },
                onError: (error) => {
                    console.error("Verification failed", error);
                    // Your business logic here to handle the error
                    console.log("error", error);
                },
            });
        } catch (error) {
            console.error("Error in getVerificationReq", error);
            // Handle error gracefully, e.g., show a notification to the user
            // and possibly revert UI changes made before the error occurred
        }
    };

    const handleButtonClick = (providerId) => {
        setProofs(null);
        getVerificationReq(providerId);
    };

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await fetch(
                    "https://api.reclaimprotocol.org/api/providers/verified"
                );
                const data = await response.json();
                if (data.providers) {
                    const formattedProviders = data.providers.map(
                        (provider) => ({
                            name: provider.name,
                            providerId: provider.httpProviderId,
                        })
                    );
                    console.log("formattedProviders", formattedProviders);
                    setMyProviders(formattedProviders);
                }
            } catch (error) {
                console.error("Error fetching providers:", error);
            }
        };

        fetchProviders();
    }, []);

    //** Render */
    return (
        <>
            <select
                value={selectedProviderId}
                onChange={(e) => {
                    setSelectedProviderId(e.target.value);
                    handleButtonClick(e.target.value);
                }}
                className="w-full px-4 py-2 text-lg text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6"
            >
                <option value="" disabled>
                    Select a provider
                </option>
                {myProviders.map((provider) => (
                    <option
                        key={provider.providerId}
                        value={provider.providerId}
                    >
                        {provider.name}
                    </option>
                ))}
            </select>

            <button
                onClick={() => window.open(url, "_blank")}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
                Open Link
            </button>

            {proofs && (
                <div className="bg-[#1e293b] p-6 rounded-lg shadow-xl mt-6">
                    <h3 className="text-2xl font-semibold mb-4 text-blue-300">
                        Proofs Received
                    </h3>
                    <div className="bg-[#0f172a] p-4 rounded-lg overflow-hidden">
                        <div className="max-h-[600px] overflow-y-auto pr-4">
                            <JSONPretty
                                id="json-pretty"
                                data={proofs?.claimData}
                                theme={{
                                    main: "line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;",
                                    error: "line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;",
                                    key: "color:#f92672;",
                                    string: "color:#fd971f;",
                                    value: "color:#a6e22e;",
                                    boolean: "color:#ac81fe;",
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
