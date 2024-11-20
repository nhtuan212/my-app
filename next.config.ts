import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    webpack(config) {
        config.module.rules.push({
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
            use: {
                loader: "url-loader",
                options: {
                    limit: 8192,
                    // Inline files smaller than 8KB
                    name: "[name].[ext]",
                    outputPath: "static/media/", // Output path for the files
                },
            },
        });

        return config;
    },
};

export default nextConfig;
