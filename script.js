document.addEventListener('DOMContentLoaded', () => {
    const e1k = document.getElementById("1k");
    const e2k = document.getElementById("2k");
    const e5k = document.getElementById("5k");
    const e10k = document.getElementById("10k");
    const e20k = document.getElementById("20k");
    const e50k = document.getElementById("50k");
    const e100k = document.getElementById("100k");
    const e200k = document.getElementById("200k");
    const e500k = document.getElementById("500k");

    const txt1k = document.getElementById("txt1k");
    const txt2k = document.getElementById("txt2k");
    const txt5k = document.getElementById("txt5k");
    const txt10k = document.getElementById("txt10k");
    const txt20k = document.getElementById("txt20k");
    const txt50k = document.getElementById("txt50k");
    const txt100k = document.getElementById("txt100k");
    const txt200k = document.getElementById("txt200k");
    const txt500k = document.getElementById("txt500k");
    
    const txtFinalCash = document.getElementById("txtFinalCash");
    const txtFinalCashInWords = document.getElementById("txtFinalCashInWords");
    const btnReset = document.getElementById("btnReset");
    const btnSpeakTotalCash = document.getElementById("btnSpeakTotalCash");

    const cashInputs = [e1k,e2k,e5k,e10k,e20k,e50k,e100k,e200k,e500k];
    const cashTexts = [txt1k,txt2k,txt5k,txt10k,txt20k,txt50k,txt100k,txt200k,txt500k];
  
    cashInputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        cashCalculate(index);
      });
    });
  
    btnReset.addEventListener('click', clearData);
  
    function cashCalculate(index) {
      const denominations = [1000,2000,5000,10000,20000,50000,100000,200000,500000];
      const rowValue = cashInputs[index].value * denominations[index];
      const formattedValue = rowValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      cashTexts[index].textContent = formattedValue || '0';
      totalCash();
    }
  
    function totalCash() {
      let totalCashValue = 0;
      cashTexts.forEach((text) => {
        totalCashValue += parseInt(text.textContent.replace(/\./g, '')) || 0;
      });
      const formattedCash = totalCashValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      txtFinalCash.textContent = 'Total Cash: ' + formattedCash + ' VND';
      const cashInWords = convertToWords(totalCashValue);
      txtFinalCashInWords.textContent = `Total Cash In Words: ${cashInWords}`;
      // speakTotalCash(cashInWords); // Bỏ tự động đọc khi thay đổi số tiền
    }
  
    function clearData() {
      cashInputs.forEach((input) => {
        input.value = '';
      });
      cashTexts.forEach((text) => {
        text.textContent = '0';
      });
      totalCash();
    }
  
    function convertToWords(number) {
      const units = ['', 'Một', 'Hai', 'Ba', 'Bốn', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín'];
  
      if (number === 0) {
        return 'Không';
      }
  
      let words = '';

      if (Math.floor(number / 100000000000) > 0) {
        words += convertToWords(Math.floor(number / 100000000000)) + ' Trăm Tỷ ';
        number %= 100000000000;
      }

      if (Math.floor(number / 1000000000) > 0) {
        words += convertToWords(Math.floor(number / 1000000000)) + ' Tỷ ';
        number %= 1000000000;
      }

      if (Math.floor(number / 100000000) > 0) {
        words += convertToWords(Math.floor(number / 100000000)) + ' Trăm Triệu ';
        number %= 100000000;
      }
  
      if (Math.floor(number / 1000000) > 0) {
        words += convertToWords(Math.floor(number / 1000000)) + ' Triệu ';
        number %= 1000000;
      }
  
      if (Math.floor(number / 100000) > 0) {
        words += convertToWords(Math.floor(number / 100000)) + ' Trăm Ngàn ';
        number %= 100000;
      }
  
      if (Math.floor(number / 1000) > 0) {
        words += convertToWords(Math.floor(number / 1000)) + ' Ngàn ';
        number %= 1000;
      }
  
      if (Math.floor(number / 100) > 0) {
        words += convertToWords(Math.floor(number / 100)) + ' Trăm ';
        number %= 100;
      }
  
      if (number > 0) {
          if (number >= 10 && number <= 19) 
          {
              words = "Mười " + units[number % 10]; 
          }
          else if (number < 10) {
              words += units[number];
          }
          else {
              words += units[Math.floor(number / 10)] + " Mươi "; 
              if (number % 10 > 0) {
                words += ' ' + units[number % 10];
              }
          }
      }
       
      return words.trim() + ' Đồng';
    }

    // Hàm đọc tổng số tiền bằng FPT.AI
    async function speakTotalCashFPT(words) {
      const apiKey = "0ZT07pR1crUIWOxM67kURF01CAepJKmc";
      const url = "https://api.fpt.ai/hmi/tts/v5";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "api-key": apiKey,
            "speed": "0",
            "voice": "banmai",
            "Content-Type": "text/plain"
          },
          body: words
        });
        if (!response.ok) throw new Error("FPT.AI API error");
        const audioUrl = response.headers.get("location");
        if (audioUrl) {
          const audio = new Audio(audioUrl);
          audio.play();
        } else {
          throw new Error("No audio URL returned");
        }
      } catch (e) {
        // Fallback: dùng SpeechSynthesisUtterance nếu API lỗi
        speakTotalCash(words);
      }
    }

    // Populate voices when they are loaded
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices:', voices);
    };

    cashInputs.forEach(input => {
        input.addEventListener('input', () => {
          const value = parseInt(input.value, 10);
          if (isNaN(value) || value < 0) {
            input.value = '';
          }
        });
      });

    // Thêm sự kiện cho nút loa
    btnSpeakTotalCash.addEventListener('click', () => {
      const words = txtFinalCashInWords.textContent.replace('Total Cash In Words: ', '');
      speakTotalCashFPT(words);
    });
});
