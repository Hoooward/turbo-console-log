import * as vscode from 'vscode';
import { DebugMessage } from './debug-message';
import { JSDebugMessage } from './debug-message/js';
import { Command, ExtensionProperties } from './entities';
import { getAllCommands } from './commands/';
import { DebugMessageLine, LanguageProcessor } from './debug-message/types';

// 导出一个函数，用于激活插件
export function activate(): void {
  // 创建一个行代码处理类
  const GeneralLineCodeProcessing: LineCodeProcessing = new JSLineCodeProcessing();
  // 创建一个DebugMessageLine类
  const debugMessageLine: DebugMessageLine = new GeneralDebugMessageLine(GeneralLineCodeProcessing);
  // 创建一个DebugMessage类
  const generalDebugMessage: DebugMessage = new GeneralDebugMessage(generalLineCodeProcessing, debugMessageLine);
  // 获取配置信息
  const config: vscode.WorkspaceConfiguration =
    vscode.workspace.getConfiguration('turboConsoleLog');
  // 获取扩展属性
  const properties: ExtensionProperties = getExtensionProperties(config);
  // 获取所有命令
  const commands: Array<Command> = getAllCommands();
  // 遍历所有命令，注册命令
  for (const { name, handler } of commands) {
    vscode.commands.registerCommand(name, (args: unknown[]) => {
      handler(properties, generalDebugMessage, args);
    });
  }
}

// 获取扩展属性
function getExtensionProperties(workspaceConfig: vscode.WorkspaceConfiguration) {
  // 返回扩展属性
  return {
    wrapLogMessage: workspaceConfig.wrapLogMessage ?? false,
    logMessagePrefix: workspaceConfig.logMessagePrefix ?? '🚀',
    logMessageSuffix: workspaceConfig.logMessageSuffix ?? ':',
    addSemicolonInTheEnd: workspaceConfig.addSemicolonInTheEnd ?? false,
    insertEmptyLineBeforeLogMessage: workspaceConfig.insertEmptyLineBeforeLogMessage ?? false,
    insertEmptyLineAfterLogMessage: workspaceConfig.insertEmptyLineAfterLogMessage ?? false,
    quote: workspaceConfig.quote ?? '"',
    delimiterInsideMessage: workspaceConfig.delimiterInsideMessage ?? '~',
    includeFileNameAndLineNum: workspaceConfig.includeFileNameAndLineNum ?? false,
    logFunction: workspaceConfig.logFunction ?? 'log',
  };
}
