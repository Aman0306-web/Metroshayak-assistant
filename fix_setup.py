import sys
import subprocess
import os
import importlib.util

def install_pip():
    print("🔧 Checking for pip...")
    if importlib.util.find_spec("pip") is None:
        print("⚠️ Pip not found. Installing via ensurepip...")
        try:
            import ensurepip
            ensurepip.bootstrap(default_pip=True)
            print("✅ Pip installed successfully.")
        except ImportError:
            print("❌ Critical Error: 'ensurepip' is missing from your Python installation.")
            print("Please reinstall Python and ensure 'pip' is selected in the installer.")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Error installing pip: {e}")
            sys.exit(1)
    else:
        print("✅ Pip is already installed.")

def install_requirements():
    print("\n📦 Installing dependencies from requirements.txt...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "-r", "requirements.txt"])
        print("\n✅ Success! All dependencies installed.")
        print("🚀 You can now run: python main.py")
    except subprocess.CalledProcessError:
        print("\n❌ Failed to install dependencies.")
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")

if __name__ == "__main__":
    print(f"Python Environment: {sys.executable}")
    install_pip()
    install_requirements()