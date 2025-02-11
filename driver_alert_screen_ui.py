import tkinter as tk
from tkinter import Label, Button, Frame
import time

# Create Main Window (800x400)
root = tk.Tk()
root.title("Driver Alert System")
root.geometry("800x400")  # Set to exact screen size
root.configure(bg="#141414")  # Dark background

# ====================== STATUS INDICATOR (Centered at Top) ======================
status_frame = Frame(root, bg="#1F1F1F", padx=30, pady=10)
status_frame.place(relx=0.5, rely=0.08, anchor="center")  # Positioned at the top

status_label = Label(status_frame, text="Driver Status:", font=("Arial", 20, "bold"), fg="white", bg="#1F1F1F")
status_label.pack(side="left")

critical_label = Label(status_frame, text="Critical", font=("Arial", 20, "bold"), fg="red", bg="#1F1F1F")
critical_label.pack(side="left", padx=10)

# ====================== ALERT POPUP (Positioned Below Status) ======================
alert_frame = Frame(root, bg="#282828", padx=30, pady=20, highlightbackground="white", highlightthickness=4)
alert_frame.place(relx=0.5, rely=0.45, anchor="center")  # Positioned below status

# Alert Icon (Centered Above Warning)
alert_icon = Label(alert_frame, text="⚠️", font=("Arial", 40), fg="white", bg="#282828")
alert_icon.pack()

# Warning Message (Smaller & Centered)
alert_message = Label(alert_frame, text="Warning\nREST SOON", font=("Arial", 18, "bold"), fg="white", bg="red", width=25, height=2)
alert_message.pack(pady=10)

# "OK" Button (Touch to Dismiss Warning)
def dismiss_warning():
    alert_frame.destroy()

ok_button = Button(alert_frame, text="OK", font=("Arial", 14, "bold"), fg="white", bg="gray", padx=15, pady=5, relief="flat", width=8, command=dismiss_warning)
ok_button.pack(pady=5)

# ====================== EMERGENCY BUTTON ======================
calling_label = Label(root, text="", font=("Arial", 14, "bold"), fg="white", bg="#141414")
calling_label.place(relx=0.5, rely=0.7, anchor="center")  # Placeholder for call status

def call_emergency():
    calling_label.config(text="📞 Calling Emergency...", fg="red")
    root.update()
    time.sleep(2)  # Simulate call in progress
    calling_label.config(text="✅ Call Connected", fg="green")
    root.update()
    time.sleep(2)
    calling_label.config(text="")  # Remove text after showing success

dial_button = Button(root, text="🚨 Contact Emergency", font=("Arial", 14, "bold"), fg="white", bg="#D90429", padx=30, pady=10, relief="flat", command=call_emergency)
dial_button.place(relx=0.5, rely=0.85, anchor="center")  # Centered at bottom

# Run Tkinter Main Loop
root.mainloop()
