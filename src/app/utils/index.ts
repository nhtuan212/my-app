import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";

export const getVerificationReq = async () => {
    // Your credentials from the Reclaim Developer Portal
    // Replace these with your actual credentials
    const APP_ID = "YOUR_APPLICATION_ID";
    const APP_SECRET = "YOUR_APPLICATION_SECRET";
    const PROVIDER_ID = "YOUR_PROVIDER_ID";

    // Initialize the Reclaim SDK with your credentials
    const reclaimProofRequest = await ReclaimProofRequest.init(
        APP_ID,
        APP_SECRET,
        PROVIDER_ID
    );

    // Generate the verification request URL
    const requestUrl = await reclaimProofRequest.getRequestUrl();
    console.log("Request URL:", requestUrl);
    // setRequestUrl(requestUrl);

    // Start listening for proof submissions
    await reclaimProofRequest.startSession({
        // Called when the user successfully completes the verification
        onSuccess: (proofs) => {
            if (proofs) {
                if (typeof proofs === "string") {
                    // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
                    console.log("SDK Message:", proofs);
                    // setProofs([proofs]);
                } else if (typeof proofs !== "string") {
                    // When using the default callback url, we get a proof object in the response
                    console.log(
                        "Verification success",
                        proofs?.claimData.context
                    );
                    // setProofs(proofs);
                }
            }
            // Add your success logic here, such as:
            // - Updating UI to show verification success
            // - Storing verification status
            // - Redirecting to another page
        },
        // Called if there's an error during verification
        onError: (error) => {
            console.error("Verification failed", error);

            // Add your error handling logic here, such as:
            // - Showing error message to user
            // - Resetting verification state
            // - Offering retry options
        },
    });
};
