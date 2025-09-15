import os
import smtplib
from email.mime.text import MIMEText
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Gemini client once
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel(model_name="gemini-2.5-flash")

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

# 🔽 Replace your old function with this one
@app.route("/api/generate-email", methods=["POST"])
def generate_email():
    data = request.get_json()
    prompt = data.get("prompt")
    recipient = data.get("recipient")
    subject = data.get("subject")

    if not prompt or not recipient or not subject:
        return jsonify({"error": "All fields are required"}), 400

    # Debug logs
    print("🟢 Incoming request:")
    print("  Recipient:", recipient)
    print("  Subject:", subject)
    print("  Prompt:", prompt)

    try:
        response = model.generate_content(
            f"Write a professional email to {recipient} about '{subject}'. {prompt} "
            f"Do not include placeholders like [Your Name], [Your Title], or [Your Organization]. "
            f"Just end with 'Best regards, AI Email Generator'."
        )
        generated_email = response.text.strip() if response and response.text else None
        print("✅ Gemini response received.")
    except Exception as e:
        print("⚠️ Gemini API failed:", e)
        generated_email = None

    if not generated_email:
        generated_email = f"""
Hi {recipient},

This is a fallback sample email regarding "{subject}".
Your input was: "{prompt}"

Regards,
AI Email Generator
"""
        print("ℹ️ Using fallback email content.")

    try:
        print("📧 Preparing to send email...")
        print("  From:", EMAIL_USER)
        print("  To:", recipient)
        print("  Subject:", subject)
        print("  EMAIL_USER exists:", bool(EMAIL_USER))
        print("  EMAIL_PASS exists:", bool(EMAIL_PASS))

        msg = MIMEText(generated_email)
        msg["From"] = EMAIL_USER
        msg["To"] = recipient
        msg["Subject"] = subject

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, recipient, msg.as_string())

        print("✅ Email sent successfully!")

    except Exception as e:
        print("❌ Failed to send email:", e)

    return jsonify({"email_body": generated_email})

if __name__ == "__main__":
    app.run(debug=True, port=5000)





