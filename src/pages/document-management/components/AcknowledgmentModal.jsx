import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AcknowledgmentModal = ({ document, isOpen, onClose, onConfirm }) => {
  const [signature, setSignature] = useState('');
  const [comments, setComments] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureType, setSignatureType] = useState('typed'); // 'typed' or 'drawn'
  const canvasRef = useRef(null);
  const [lastPoint, setLastPoint] = useState(null);

  const handleCanvasMouseDown = (e) => {
    if (signatureType !== 'drawn') return;
    setIsDrawing(true);
    const rect = canvasRef?.current?.getBoundingClientRect();
    const point = {
      x: e?.clientX - rect?.left,
      y: e?.clientY - rect?.top
    };
    setLastPoint(point);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing || signatureType !== 'drawn') return;
    
    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext('2d');
    const rect = canvas?.getBoundingClientRect();
    const currentPoint = {
      x: e?.clientX - rect?.left,
      y: e?.clientY - rect?.top
    };

    ctx?.beginPath();
    ctx?.moveTo(lastPoint?.x, lastPoint?.y);
    ctx?.lineTo(currentPoint?.x, currentPoint?.y);
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx?.stroke();

    setLastPoint(currentPoint);
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearSignature = () => {
    if (signatureType === 'drawn') {
      const canvas = canvasRef?.current;
      const ctx = canvas?.getContext('2d');
      ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
    } else {
      setSignature('');
    }
  };

  const handleConfirm = () => {
    let signatureData = '';
    
    if (signatureType === 'typed') {
      signatureData = signature;
    } else {
      signatureData = canvasRef?.current?.toDataURL();
    }

    const acknowledgmentData = {
      documentId: document?.id,
      signature: signatureData,
      signatureType,
      comments,
      timestamp: new Date()?.toISOString(),
      ipAddress: '192.168.1.100', // Mock IP
      userAgent: navigator.userAgent,
      employeeId: 'EMP001',
      employeeName: 'Sarah Johnson'
    };

    onConfirm(acknowledgmentData);
  };

  const isSignatureValid = () => {
    if (signatureType === 'typed') {
      return signature?.trim()?.length >= 2;
    } else {
      const canvas = canvasRef?.current;
      const ctx = canvas?.getContext('2d');
      const imageData = ctx?.getImageData(0, 0, canvas?.width, canvas?.height);
      return imageData?.data?.some(channel => channel !== 0);
    }
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-900 border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileSignature" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Document Acknowledgment</h2>
              <p className="text-sm text-muted-foreground">Confirm you have read and understood this document</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted rounded-full">
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Document Info */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">{document?.title}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Version:</span>
                <span className="ml-2 font-medium">{document?.version}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Effective Date:</span>
                <span className="ml-2 font-medium">{new Date(document.effectiveDate)?.toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Department:</span>
                <span className="ml-2 font-medium">{document?.department}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <span className="ml-2 font-medium capitalize">{document?.category}</span>
              </div>
            </div>
          </div>

          {/* Acknowledgment Statement */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-2">Acknowledgment Statement</h4>
                <p className="text-sm text-foreground leading-relaxed">
                  By providing my signature below, I acknowledge that I have read, understood, and agree to comply with 
                  the policies, procedures, and requirements outlined in this document. I understand that failure to 
                  comply with these requirements may result in disciplinary action.
                </p>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Digital Signature</h4>
            
            {/* Signature Type Toggle */}
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setSignatureType('typed')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                  signatureType === 'typed' ?'border-primary bg-primary/10 text-primary' :'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="Type" size={16} />
                <span>Type Signature</span>
              </button>
              <button
                onClick={() => setSignatureType('drawn')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                  signatureType === 'drawn' ?'border-primary bg-primary/10 text-primary' :'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="PenTool" size={16} />
                <span>Draw Signature</span>
              </button>
            </div>

            {/* Signature Input */}
            {signatureType === 'typed' ? (
              <Input
                type="text"
                placeholder="Type your full name as signature"
                value={signature}
                onChange={(e) => setSignature(e?.target?.value)}
                className="font-serif text-lg"
              />
            ) : (
              <div className="border border-border rounded-lg p-4 bg-background">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={150}
                  className="w-full h-32 border border-dashed border-border rounded cursor-crosshair"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">Draw your signature above</p>
                  <Button variant="ghost" size="sm" onClick={clearSignature}>
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e?.target?.value)}
              placeholder="Add any comments or questions about this document..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
          </div>

          {/* Legal Notice */}
          <div className="bg-muted/30 rounded-lg p-4 text-xs text-muted-foreground">
            <div className="flex items-start space-x-2">
              <Icon name="Shield" size={14} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="mb-1">
                  <strong>Legal Notice:</strong> This electronic signature has the same legal effect as a handwritten signature.
                </p>
                <p>
                  Timestamp: {new Date()?.toLocaleString()} | IP: 192.168.1.100 | User: Sarah Johnson (EMP001)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={!isSignatureValid()}
            iconName="CheckCircle"
            iconPosition="left"
          >
            Confirm Acknowledgment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AcknowledgmentModal;