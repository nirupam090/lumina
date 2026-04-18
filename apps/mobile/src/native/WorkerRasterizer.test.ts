import { WorkerRasterizer } from './WorkerRasterizer';

describe('WorkerRasterizer (JSI Bridge Module)', () => {
  it('triggers progressive compression natively strictly when the memory queue exceeds 10MB physically', () => {
    const rasterizer = new WorkerRasterizer();
    const mockCompression = jest.fn();

    // 9.5 MB array - No trigger
    rasterizer.evaluateArraySize(9.5, mockCompression);
    expect(mockCompression).not.toHaveBeenCalled();

    // 10.2 MB array - Execution physically triggered bridging the UI thread safely
    rasterizer.evaluateArraySize(10.2, mockCompression);
    expect(mockCompression).toHaveBeenCalledWith(true);
  });
});
