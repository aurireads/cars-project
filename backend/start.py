#!/usr/bin/env python3
"""
Script para inicializar o projeto WS Work Cars
Executa o backend e fornece instruções para o frontend
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def print_banner():
    """Imprime banner do projeto"""
    print("=" * 60)
    print("🚗 WS WORK CARS - SISTEMA DE GERENCIAMENTO DE VEÍCULOS")
    print("=" * 60)
    print()

def check_python():
    """Verifica se Python está instalado"""
    try:
        version = sys.version_info
        if version.major < 3 or (version.major == 3 and version.minor < 8):
            print("❌ Python 3.8+ é necessário!")
            print(f"   Versão atual: {version.major}.{version.minor}")
            return False
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} detectado")
        return True
    except Exception as e:
        print(f"❌ Erro ao verificar Python: {e}")
        return False

def setup_backend():
    """Configura o ambiente do backend"""
    print("\n🔧 CONFIGURANDO BACKEND...")
    
    # Verificar se estamos na pasta correta
    if not os.path.exists("main.py"):
        print("❌ Arquivo main.py não encontrado!")
        print("   Execute este script na pasta do backend")
        return False
    
    # Verificar se requirements.txt existe
    if not os.path.exists("requirements.txt"):
        print("❌ Arquivo requirements.txt não encontrado!")
        return False
    
    # Verificar se ambiente virtual existe
    venv_path = Path("venv")
    if not venv_path.exists():
        print("📦 Criando ambiente virtual...")
        try:
            subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
            print("✅ Ambiente virtual criado")
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro ao criar ambiente virtual: {e}")
            return False
    else:
        print("✅ Ambiente virtual encontrado")
    
    # Determinar comando de ativação
    if os.name == 'nt':  # Windows
        activate_cmd = "venv\\Scripts\\activate"
        pip_cmd = "venv\\Scripts\\pip"
        python_cmd = "venv\\Scripts\\python"
    else:  # Linux/Mac
        activate_cmd = "source venv/bin/activate"
        pip_cmd = "venv/bin/pip"
        python_cmd = "venv/bin/python"
    
    # Instalar dependências
    print("📦 Instalando dependências...")
    try:
        subprocess.run([pip_cmd, "install", "-r", "requirements.txt"], check=True)
        print("✅ Dependências instaladas")
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao instalar dependências: {e}")
        return False
    
    # Verificar se banco existe e popular se necessário
    if not os.path.exists("cars.db"):
        print("🗄️  Criando banco de dados e inserindo dados iniciais...")
        try:
            subprocess.run([python_cmd, "seed_data.py"], check=True)
            print("✅ Banco de dados criado e populado")
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro ao criar banco: {e}")
            return False
    else:
        print("✅ Banco de dados encontrado")
    
    return True, python_cmd

def start_backend(python_cmd):
    """Inicia o servidor backend"""
    print("\n🚀 INICIANDO SERVIDOR BACKEND...")
    print("   URL: http://localhost:8000")
    print("   Docs: http://localhost:8000/docs")
    print("   Para parar: Ctrl+C")
    print("\n" + "="*60)
    
    try:
        subprocess.run([python_cmd, "main.py"])
    except KeyboardInterrupt:
        print("\n\n🛑 Servidor parado pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro ao executar servidor: {e}")

def print_frontend_instructions():
    """Imprime instruções para o frontend"""
    print("\n" + "="*60)
    print("📱 PARA EXECUTAR O FRONTEND:")
    print("="*60)
    print("1. Abra um NOVO terminal")
    print("2. Navegue para a pasta do frontend:")
    print("   cd ../frontend")
    print()
    print("3. Instale as dependências (primeira vez):")
    print("   npm install")
    print()
    print("4. Execute o frontend:")
    print("   npm start")
    print()
    print("5. Acesse: http://localhost:3000")
    print("="*60)

def main():
    """Função principal"""
    print_banner()
    
    # Verificar Python
    if not check_python():
        sys.exit(1)
    
    # Configurar backend
    setup_result = setup_backend()
    if not setup_result:
        print("\n❌ Falha na configuração do backend")
        sys.exit(1)
    
    success, python_cmd = setup_result
    if not success:
        sys.exit(1)
    
    # Mostrar instruções do frontend
    print_frontend_instructions()
    
    # Aguardar confirmação
    print("\n⚡ Pressione ENTER para iniciar o backend ou Ctrl+C para cancelar...")
    try:
        input()
    except KeyboardInterrupt:
        print("\n🛑 Cancelado pelo usuário")
        sys.exit(0)
    
    # Iniciar backend
    start_backend(python_cmd)

if __name__ == "__main__":
    main()