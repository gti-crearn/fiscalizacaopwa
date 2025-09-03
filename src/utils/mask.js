// CPF: 000.000.000-00
export const maskCPF = (value) => {
    return value
      .replace(/\D/g, "") // só números
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };
  
  // CNPJ: 00.000.000/0000-00
  export const maskCNPJ = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
      .slice(0, 18);
  };
  
  // Telefone: (00) 00000-0000
  export const maskTelefone = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };
  
  // Email (não é bem máscara, é validação ao digitar)
  export const maskEmail = (value) => {
    return value.replace(/\s/g, ""); // só remove espaços
  };
  