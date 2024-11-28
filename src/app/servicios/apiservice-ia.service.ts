import { Injectable } from '@angular/core';
import Groq from 'groq-sdk';

@Injectable({
  providedIn: 'root',
})
export class APIServiceIAService {
  private readonly groq: any;
  private messages: { role: string; content: string }[] = [];

  constructor() {
    this.groq = new Groq({
      apiKey: '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',
      dangerouslyAllowBrowser: true,
    });
  }

  async askProfessorChat(
    promptFirstRole: string,
    firstRole: string,
    promptSecondRoleProfessor: string,
    secondRole: string
  ): Promise<string> {
    this.messages.push(
      { role: firstRole, content: promptFirstRole },
      { role: secondRole, content: promptSecondRoleProfessor }
    );

    try {
      const response = await this.groq.chat.completions.create({
        messages: this.messages,
        model: 'llama-3.2-90b-vision-preview',
      });
      const htmlResponse = response.choices[0].message.content;
      console.log('API Response:', htmlResponse);
      return htmlResponse;
    } catch (error) {
      console.error('Error en askProfessorChat:', error);
      throw new Error('Error al procesar la solicitud al chat del profesor.');
    }
  }

  async askChat(prompt: string, role: string): Promise<string> {
    this.messages.push({ role: role, content: prompt });

    try {
      const response = await this.groq.chat.completions.create({
        messages: this.messages, 
        model: 'llama-3.2-90b-vision-preview',
      });
      const htmlResponse = response.choices[0].message.content;
      console.log('API Response:', htmlResponse);
      return htmlResponse;
    } catch (error) {
      console.error('Error en askChat:', error);
      throw new Error('Error al procesar la solicitud del usuario.');
    }
  }

  clearMessages() {
    this.messages = [];
  }
}
