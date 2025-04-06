import crypto from "crypto";
import mongoose from "mongoose";
import {
    ENC_ALGORITHM,
    ENC_SECRET_KEY,
} from "../config/env.js";

const algorithm = ENC_ALGORITHM;
const secretKey = ENC_SECRET_KEY;
const iv = crypto.randomBytes(16);

export const encrypt = (text) => {
    if (typeof text != "string" || mongoose.Types.ObjectId.isValid(text)) {
        text = text.toString();
    }
    const cipher = crypto.createCipheriv(
        algorithm,
        Buffer.from(secretKey, "hex"),
        iv,
    );
    let encryptedText = cipher.update(text);
    encryptedText = Buffer.concat([encryptedText, cipher.final()]);
    return iv.toString("hex") + ":" + encryptedText.toString("hex");
};

export const decrypt = (text) => {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(secretKey, "hex"),
        iv,
    );
    let decryptedText = decipher.update(encryptedText);
    decryptedText = Buffer.concat([decryptedText, decipher.final()]);
    return decryptedText.toString();
};

export const decryptIds = (object) => {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            if (typeof obj[key] === "object" && object[key] !== null) {
                decryptIds(object[key]);
            } else if (key.toLowerCase().includes("id")) {
                object[key] = decrypt(object[key]);
            }
        }
    }
};

export const encryptIds = (data) => {
    const encryptObjectIds = (object) => {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                if (key === "_id") {
                    object["id"] = encrypt(object[key]);
                    delete object[key];
                } else if (typeof object[key] === "object" && object[key] !== null) {
                    encryptObjectIds(object[key]);
                }
            }
        }
    };

    return data.map((datum) => {
        let object = datum;
        if (typeof datum.toObject === "function") {
            object = datum.toObject();
        }
        encryptObjectIds(object);
        return object;
    });
};