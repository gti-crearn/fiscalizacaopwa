export function formatDateBR(isoString) {
    const date = new Date(isoString);
  
    const pad = (num) => String(num).padStart(2, "0");
  
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
  
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
  
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  export function formatCNPJ(cnpj) {
    if (!cnpj) return "";
    
    // Remove tudo que não for número
    cnpj = cnpj.replace(/\D/g, "");
  
    // Aplica a máscara
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  }
  
